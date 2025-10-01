import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { PaymentTransaction, User } from 'src/dal/entities/payment-transaction.entity';
import { TransactionStatus } from 'src/common/enums/payment.enum';
import { BaseTransactionDto, PaystackPaymentDtoDto } from '../dto/paystack.dto';
import { PaystackService } from './paystack.service';
import { mapUserTxToResponse } from '../mapper';
import { isValidUUID } from 'src/core/utils/strings';
import { PageOptionsDto } from 'src/auth/dto/page-options.dto';

@Injectable()
export class PaymentService {
  fetchTransactions(pageOptions: PageOptionsDto) {
    throw new Error('Method not implemented.');
  }
  getTransactionTotals() {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionRepo: Repository<PaymentTransaction>,

    private readonly paystackService: PaystackService,
  ) { }

  async paystack(
    userId: string,
    payload: PaystackPaymentDtoDto,
  ): Promise<{
    transaction: BaseTransactionDto;
    paymentUrl: string;
  }> {
    const { redirectUrl, amount, email, productId } = payload;


    const transaction = this.paymentTransactionRepo.create({
      user: { id: userId } as any,
      amount,
      productId,
      status: TransactionStatus.Pending,
      reference: uuidv4(),
    
    });

    const tx = await this.paymentTransactionRepo.save(transaction);

    const response = await this.paystackService.initiate({
      amount,
      email,
      redirectUrl,
      ref: tx.id,
      productId,
    });

    const {
      data: { authorization_url: paymentUrl },
    } = response;

    if (!paymentUrl)
      throw new InternalServerErrorException('Payment initiation failed');

    return {
      transaction: mapUserTxToResponse(tx),
      paymentUrl,
    };
  }

  async confirmPaystack(
    payload: any,
    signature: string,
  ): Promise<{ message: string }> {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    const hash = createHmac('sha512', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== signature) {
      throw new HttpException('Invalid signature', 400);
    }

    const { data, event } = payload;

    if (event !== 'charge.success') {
      this.logger.log(`Ignoring event: ${event}`);
      return { message: 'Ignored non-payment event' };
    }

    const isUUID = isValidUUID(data?.reference);
    if (!isUUID) {
      this.logger.warn('Reference is not a valid UUID');
      return { message: 'Invalid reference' };
    }

    const transaction = await this.paymentTransactionRepo.findOneBy({
      id: data?.reference,
    });

    if (!transaction) return { message: 'Transaction not found' };

    if (transaction.status === TransactionStatus.Success) {
      return { message: 'Transaction already processed' };
    }

    const { status, amount, id, message } = await this.paystackService.verify(
      data.reference,
    );

    if (status === 'success') {
      await this.paymentTransactionRepo.update(transaction.id, {
        status: TransactionStatus.Success,
      });
      return { message: 'Payment successful' };
    } else {
      await this.paymentTransactionRepo.update(transaction.id, {
        status: TransactionStatus.Failed,
        failureReason: message,
      });
      return { message: 'Payment failed' };
    }
  }
}




