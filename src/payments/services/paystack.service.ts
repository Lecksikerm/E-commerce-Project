import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import axios from 'axios';
import { PaystackPayloadDto, PaystackVerifyResponseData, PaystackVerifyResponseDto, } from '../dto/paystack.dto';
import { Currency, TransactionStatus } from 'src/common/enums/payment.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/dal/entities/product.entity';
import { PaymentTransaction } from 'src/dal/entities/payment-transaction.entity';
import { createHmac } from 'crypto';

@Injectable()
export class PaystackService {
  
  private baseUrl: string;
  private headers: any;
  private readonly logger = new Logger(PaystackService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionRepo: Repository<PaymentTransaction>,
  ) {
    this.baseUrl = 'https://api.paystack.co';
    this.headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  async verify(reference: string): Promise<PaystackVerifyResponseData> {
    const { data } = await axios.get(
      `${this.baseUrl}/transaction/verify/${reference}`,
      { headers: this.headers },
    );

    if (data.status !== true) {
      throw new InternalServerErrorException('Unable to verify transaction');
    }

    const {
      data: { amount, status, fee, id },
      message,
    } = data;

    return {
      id,
      status,
      amount: +amount / 100,
      fee: fee/ 100,
      paid_at: data.paid_at,
      reference: data.reference,
      currency: data.currency,
       customer: {
      email: data.customer.email,
    }
    };
  }

  async initiate(req: PaystackPayloadDto): Promise<any> {
    const { amount, ref, email, redirectUrl, productId } = req;

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    if (product.price > amount) {
      throw new BadRequestException(
        `Invalid amount: product price is ${product.price}, but got ${amount}`,
      );
    }

    const payload = {
      currency: Currency.NGN,
      amount: +amount * 100,
      reference: ref,
      email,
      callback_url: redirectUrl,
      channels: ['card'],
    };

    try {
      const { data } = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        payload,
        { headers: this.headers },
      );
      return data;
    } catch (error: any) {
      this.logger.error(error?.response?.data || error?.message);
      throw new InternalServerErrorException('Unable to initiate payment');
    }
  }

  async verifyPayment(reference: string) {
    return this.verify(reference);
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    try {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      const hash = createHmac('sha512', secret).update(rawBody).digest('hex');

      if (hash !== signature) {
        this.logger.warn('Invalid Paystack signature');
        throw new BadRequestException('Invalid signature');
      }

      const payload = JSON.parse(rawBody.toString());
      this.logger.log(`Webhook event received: ${payload.event}`);

      if (payload.event !== 'charge.success') {
        return { message: 'Ignored non-payment event' };
      }

      const reference = payload.data.reference;

      const transaction = await this.paymentTransactionRepo.findOne({
        where: {  reference },
        relations: ['product'],
      });

      if (!transaction) {
        this.logger.warn(`Transaction not found for ref: ${reference}`);
        return { message: 'Transaction not found' };
      }

      if (transaction.status === TransactionStatus.Success) {
        return { message: 'Transaction already processed' };
      }

      transaction.status = TransactionStatus.Success;
      await this.paymentTransactionRepo.save(transaction);

      if (transaction.productId) {
        const product = await this.productRepo.findOne({
          where: { id: transaction.productId},
        });

        if (product) {
          if (product.stock && product.stock > 0) {
            product.stock -= 1;
            await this.productRepo.save(product);
            this.logger.log(
              `Product ${product.id} stock reduced. Remaining: ${product.stock}`,
            );
          }
        }
      }

      return { message: 'Payment successful and transaction updated' };
    } catch (error: any) {
      this.logger.error(error?.response?.data || error?.message);
      throw new InternalServerErrorException('Webhook processing failed');
    }
  }
  async listTransactions(params: { perPage?: number; page?: number }) {
  try {
    const { perPage = 10, page = 1 } = params;

    const { data } = await axios.get(
      `${this.baseUrl}/transaction`,
      {
        headers: this.headers,
        params: {
          perPage,
          page,
        },
      },
    );

    if (data.status !== true) {
      throw new InternalServerErrorException('Unable to fetch transactions');
    }

    return data;
  } catch (error: any) {
    this.logger.error(error?.response?.data || error?.message);
    throw new InternalServerErrorException('Error fetching transactions from Paystack');
  }
}

}
