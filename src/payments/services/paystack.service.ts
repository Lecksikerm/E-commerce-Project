import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PaymentTransaction } from 'src/dal/entities/payment-transaction.entity';
import {
  PaystackInitResponseDto,
  PaystackVerifyResponseDto,
  PaystackWebhookDto,
  PaystackPayload,
} from '../dto/paystack.dto';
import { TransactionStatus } from 'src/common/enums/payment.enum';
import * as crypto from 'crypto';

@Injectable()
export class PaystackService {
  private readonly paystackBaseUrl: string;
  private readonly paystackSecretKey: string;
  private readonly logger = new Logger(PaystackService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PaymentTransaction)
    private readonly paymentsRepo: Repository<PaymentTransaction>,
  ) {
    this.paystackBaseUrl = this.configService.get<string>('PAYSTACK_BASE_URL');
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  async initializePayment(userId: string, payload: PaystackPayload): Promise<PaystackInitResponseDto> {
    try {
      
      const reference = `PSK_${Date.now()}`;

      const transaction = this.paymentsRepo.create({
        user: { id: userId },
        amount: payload.amount,
        currency: 'NGN',
        status: TransactionStatus.Pending,
        reference,
        metadata: { planCode: payload.planCode, redirectUrl: payload.redirectUrl },
      });
      await this.paymentsRepo.save(transaction);


      const body = {
        email: payload.email,
        amount: payload.amount * 100, 
        reference,
        callback_url: payload.redirectUrl,
        channels: payload.channels || ['card', 'bank'],
        plan: payload.planCode,
      };

      const response = await axios.post(`${this.paystackBaseUrl}/transaction/initialize`, body, {
        headers: { Authorization: `Bearer ${this.paystackSecretKey}` },
      });


      return {
        status: true,
        message: 'Authorization URL created',
        data: {
          authorization_url: response.data.data.authorization_url,
          access_code: response.data.data.access_code,
          reference,
        },
      } as PaystackInitResponseDto;
    } catch (error: any) {
      this.logger.error('Error initializing payment', error?.message);
      throw new BadRequestException('Failed to initialize payment');
    }
  }

  async verifyPayment(reference: string): Promise<PaystackVerifyResponseDto> {
    try {
      const response = await axios.get(`${this.paystackBaseUrl}/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${this.paystackSecretKey}` },
      });


      const transaction = await this.paymentsRepo.findOne({ where: { reference } });
      if (transaction && response.data.data.status === 'success') {
        transaction.status = TransactionStatus.Success;
        await this.paymentsRepo.save(transaction);
      }

      return response.data as PaystackVerifyResponseDto;
    } catch (error: any) {
      this.logger.error('Error verifying payment', error?.message);
      throw new BadRequestException('Failed to verify payment');
    }
  }

  async handleWebhook(signature: string, rawBody: string): Promise<{ received: boolean }> {
    try {
      const hash = crypto.createHmac('sha512', this.paystackSecretKey).update(rawBody).digest('hex');

      if (hash !== signature) {
        this.logger.warn('Invalid Paystack signature');
        return { received: false };
      }

      const payload: PaystackWebhookDto = JSON.parse(rawBody);
      this.logger.log(`Verified event: ${payload.event}`);

      if (payload.event === 'charge.success') {
        const reference = payload.data.reference;
        const transaction = await this.paymentsRepo.findOne({ where: { reference } });

        if (transaction) {
          transaction.status = TransactionStatus.Success;
          await this.paymentsRepo.save(transaction);
          this.logger.log(`Transaction ${reference} updated to SUCCESS`);
        } else {
          this.logger.warn(`Transaction ${reference} not found`);
        }
      }

      return { received: true };
    } catch (error: any) {
      this.logger.error('Error parsing webhook payload', error?.message);
      return { received: false };
    }
  }
}

