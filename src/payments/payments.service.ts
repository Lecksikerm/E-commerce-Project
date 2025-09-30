import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

import { PaymentTransaction } from '../dal/entities/payment-transaction.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaystackInitResponseDto, PaystackWebhookDto } from './dto/paystack.dto';
import { PageOptionsDto } from 'src/auth/dto/page-options.dto';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        @InjectRepository(PaymentTransaction)
        private readonly paymentsRepo: Repository<PaymentTransaction>,
        private readonly configService: ConfigService,
    ) {

    }

    private get paystackBaseUrl(): string {
        const url = this.configService.get<string>('PAYSTACK_BASE_URL');
        if (!url) throw new Error('Configuration error: PAYSTACK_BASE_URL not set');
        return url;
    }

    private get paystackSecretKey(): string {
        const key = this.configService.get<string>('PAYSTACK_SECRET_KEY');
        if (!key) throw new Error('Configuration error: PAYSTACK_SECRET_KEY not set');
        return key;
    }

    private get backendUrl(): string {
        const url = this.configService.get<string>('BACKEND_URL');
        if (!url) throw new Error('Configuration error: BACKEND_URL not set');
        return url;
    }

    async initializePayment(userId: string, dto: CreatePaymentDto) {
        try {
            const callbackUrl = `${this.backendUrl}/payments/callback`;

            const response = await axios.post<PaystackInitResponseDto>(
                `${this.paystackBaseUrl}/transaction/initialize`,
                {
                    email: dto.email,
                    amount: dto.amount,
                    metadata: {
                        userId,
                        productId: dto.productId,
                        cartId: dto.cartId,
                        callback_url: callbackUrl,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.paystackSecretKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.data.status) {
                throw new BadRequestException(
                    `Failed to initialize payment: ${response.data.message}`,
                );
            }

            const payment = this.paymentsRepo.create({
                user: { id: userId } as any,
                amount: dto.amount,
                metadata: {
                    userId,
                    productId: dto.productId,
                    cartId: dto.cartId,
                    callback_url: callbackUrl,
                },
                reference: response.data.data.reference,
                status: 'pending',
            });

            await this.paymentsRepo.save(payment);

            return {
                authorization_url: response.data.data.authorization_url,
                reference: response.data.data.reference,
                status: 'pending',
            };
        } catch (error) {
            this.logger.error(
                'Error initializing payment',
                (error as any)?.message ?? JSON.stringify(error),
            );
            throw new BadRequestException('Unable to initialize payment');
        }
    }

    async verifyPayment(reference: string) {
        try {
            const response = await axios.get(
                `${this.paystackBaseUrl}/transaction/verify/${reference}`,
                {
                    headers: { Authorization: `Bearer ${this.paystackSecretKey}` },
                },
            );

            if (!response.data.status) {
                throw new BadRequestException('Failed to verify payment');
            }

            const transaction = await this.paymentsRepo.findOne({
                where: { reference },
            });

            if (!transaction) {
                throw new BadRequestException('Transaction not found');
            }

            transaction.status = response.data.data.status;
            await this.paymentsRepo.save(transaction);

            return transaction;
        } catch (error) {
            this.logger.error(
                'Error verifying payment',
                (error as any)?.message ?? JSON.stringify(error),
            );
            throw new BadRequestException('Unable to verify payment');
        }
    }

    async handleWebhook(signature: string, rawBody: string) {
        const hash = crypto
            .createHmac('sha512', this.paystackSecretKey)
            .update(rawBody)
            .digest('hex');

        if (hash !== signature) {
            this.logger.warn(' Invalid Paystack signature');
            return { received: false };
        }

        const payload = JSON.parse(rawBody);
        this.logger.log(`Verified event: ${payload.event}`);

        if (payload.event === 'charge.success') {
            const reference = payload.data.reference;
            const transaction = await this.paymentsRepo.findOne({ where: { reference } });

            if (transaction) {
                transaction.status = payload.data.status;
                await this.paymentsRepo.save(transaction);
                this.logger.log(`Transaction ${reference} updated to success`);
            } else {
                this.logger.warn(`Transaction ${reference} not found`);
            }
        }

        return { received: true };
    }

    async getTransactionTotals() {
        try {
            const response = await axios.get(
                `${this.paystackBaseUrl}/transaction/totals`,
                {
                    headers: {
                        Authorization: `Bearer ${this.paystackSecretKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.data.status) {
                throw new BadRequestException('Failed to fetch transaction totals');
            }

            return response.data;
        } catch (error) {
            this.logger.error(
                'Error fetching transaction totals',
                (error as Error).message,
            );
            throw new BadRequestException('Unable to fetch transaction totals');
        }


    }

    async fetchTransactions(pageOptions: PageOptionsDto) {
  const { page, take } = pageOptions;

  const response = await axios.get(`${this.paystackBaseUrl}/transaction`, {
    headers: { Authorization: `Bearer ${this.paystackSecretKey}` },
    params: {
      page,
      perPage: take
    },
  });

  return response.data;
}

}


