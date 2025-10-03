import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac, UUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { PaymentTransaction } from 'src/dal/entities/payment-transaction.entity';
import { Product } from 'src/dal/entities/product.entity';
import { TransactionStatus } from 'src/common/enums/payment.enum';
import { BaseTransactionDto, PaystackPaymentDto } from '../dto/paystack.dto';
import { PaystackService } from './paystack.service';
import { mapUserTxToResponse } from '../mapper';
import { PaystackTransactionDto } from '../dto/paystack-transactions.dto';
import { PageDto } from 'src/auth/dto/page.dto';
import { PageOptionsDto } from 'src/auth/dto/page-options.dto';
import { TransactionTotalsDto } from '../dto/transaction-totals.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionRepo: Repository<PaymentTransaction>,

    private readonly paystackService: PaystackService,
  ) { }

  async paystack(
    userId: string,
    payload: {
      amount: number;
      productId: string;
      email: string;
      redirectUrl: string;   
    },
  ): Promise<{ transaction: BaseTransactionDto; paymentUrl: string }> {
    const { redirectUrl, amount, email, productId } = payload;

    if (!productId) {
      throw new BadRequestException('productId is required');
    }

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    const productPrice = Number(product.price);
    if (productPrice !== Number(amount)) {
      throw new BadRequestException(
        `Invalid amount: Product price is ${productPrice}, but got ${amount}`,
      );
    }

    const transaction = this.paymentTransactionRepo.create({
      user: { id: userId } as any,
      amount: Number(amount),
      currency: 'NGN',
      productId,
      status: TransactionStatus.Pending,
      reference: uuidv4(),
      metadata: { productId },
    });

    const tx = await this.paymentTransactionRepo.save(transaction);

    const response = await this.paystackService.initiate({
      amount: Number(amount),
      ref: tx.reference,
      email,
      redirectUrl,
      productId,
    });

    const paymentUrl = response?.data?.authorization_url;
    if (!paymentUrl) {
      throw new InternalServerErrorException('Payment initiation failed');
    }

    return {
      transaction: mapUserTxToResponse(tx),
      paymentUrl,
    };
  }

  async handleWebhook(signature: string, rawBody: Buffer): Promise<{ message: string }> {
    try {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret) {
        throw new InternalServerErrorException('PAYSTACK_SECRET_KEY not configured');
      }

      const hash = createHmac('sha512', secret)
        .update(rawBody)
        .digest('hex');

      if (hash !== signature) {
        this.logger.warn(`Invalid signature. Computed=${hash}, Received=${signature}`);
        return { message: 'Invalid signature' };
      }

      const payload = JSON.parse(rawBody.toString());
      this.logger.log(`Webhook event received: ${payload.event}`);

      const reference = payload?.data?.reference;
      if (!reference) {
        this.logger.warn('No reference found in webhook payload');
        return { message: 'No reference in payload' };
      }

      const transaction = await this.paymentTransactionRepo.findOne({ where: { reference } });
      if (!transaction) {
        this.logger.warn(`Transaction not found for reference ${reference}`);
        return { message: 'Transaction not found' };
      }

      if (transaction.status === TransactionStatus.Success) {
        this.logger.log(`Transaction ${reference} already processed`);
        return { message: 'Transaction already processed' };
      }

      if (payload.event === 'charge.success') {
        const verifyResult = await this.paystackService.verify(reference);

        if (verifyResult.status === 'success') {
          await this.paymentTransactionRepo.update(transaction.id, {
            status: TransactionStatus.Success,
          });

          if (transaction.productId) {
            try {
              const product = await this.productRepo.findOne({ where: { id: transaction.productId } });
              if (product && (product as any).stock > 0) {
                (product as any).stock = (Number(product['stock']) || 0) - 1;
                await this.productRepo.save(product);
              }
            } catch (err) {
              this.logger.warn(
                `Failed to decrement product stock: ${(err as any)?.message || err}`,)
            }
          }

          return { message: 'Payment processed successfully' };
        } else {
          await this.paymentTransactionRepo.update(transaction.id, {
            status: TransactionStatus.Failed,
          });
          return { message: 'Payment not successful according to Paystack' };
        }
      }

      return { message: `Ignored event: ${payload.event}` };
    } catch (err: any) {
      this.logger.error('Error processing webhook', err?.message || err);
      throw new InternalServerErrorException('Webhook processing failed');
    }
  }
  async getTransactionTotals(): Promise<TransactionTotalsDto> {
    try {
      const totalTransactions = await this.paymentTransactionRepo.count();

      const totalVolumeRaw = await this.paymentTransactionRepo
        .createQueryBuilder('tx')
        .select('SUM(tx.amount)', 'sum')
        .getRawOne();

      const pendingRaw = await this.paymentTransactionRepo
        .createQueryBuilder('tx')
        .where('tx.status = :status', { status: TransactionStatus.Pending })
        .select('SUM(tx.amount)', 'sum')
        .getRawOne();

      const totalVolumeByCurrency = await this.paymentTransactionRepo
        .createQueryBuilder('tx')
        .select('tx.currency', 'currency')
        .addSelect('SUM(tx.amount)', 'amount')
        .groupBy('tx.currency')
        .getRawMany();

      const pendingTransfersByCurrency = await this.paymentTransactionRepo
        .createQueryBuilder('tx')
        .select('tx.currency', 'currency')
        .addSelect('SUM(tx.amount)', 'amount')
        .where('tx.status = :status', { status: TransactionStatus.Pending })
        .groupBy('tx.currency')
        .getRawMany();

      return {
        status: true,
        message: 'Transaction totals',
        data: {
          total_transactions: totalTransactions,
          total_volume: Number(totalVolumeRaw?.sum || 0),
          total_volume_by_currency: totalVolumeByCurrency.map((r) => ({
            currency: r.currency,
            amount: Number(r.amount),
          })),
          pending_transfers: Number(pendingRaw?.sum || 0),
          pending_transfers_by_currency: pendingTransfersByCurrency.map((r) => ({
            currency: r.currency,
            amount: Number(r.amount),
          })),
        },
      };
    } catch (err: any) {
      this.logger.error('Error getting transaction totals', err?.message || err);
      throw new InternalServerErrorException('Unable to get transaction totals');
    }
  }

  async fetchTransactions(
    pageOptions: PageOptionsDto,
  ): Promise<PageDto<PaystackTransactionDto>> {
    try {
      const take = pageOptions.take ?? 10;
      const page = pageOptions.page ?? 1;

      const paystackResponse = await this.paystackService.listTransactions({
        perPage: take,
        page,
      });

      const transactions = paystackResponse?.data || [];
      const total = paystackResponse?.meta?.total ?? transactions.length;

      const mapped: PaystackTransactionDto[] = transactions.map((tx: any) => ({
        id: Number(tx.id),
        status: tx.status,
        reference: tx.reference,
        amount: tx.amount / 100,
        paid_at: tx.paid_at,
        created_at: tx.created_at,
        channel: tx.channel,
        currency: tx.currency,
        customer: {
          id: tx.customer?.id,
          email: tx.customer?.email,
        },
      }));

      return new PageDto(mapped, total);
    } catch (err: any) {
      this.logger.error('Error fetching transactions', err?.message || err);
      throw new InternalServerErrorException('Failed to fetch transactions');
    }
  }

}



