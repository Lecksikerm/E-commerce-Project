import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentTransaction } from '../../dal/entities/payment-transaction.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PageOptionsDto } from 'src/auth/dto/page-options.dto';
import { TransactionStatus } from 'src/common/enums/payment.enum';

@Injectable()
export class PaymentsService {
    logger: any;
   
    constructor(
        @InjectRepository(PaymentTransaction)
        private readonly paymentsRepo: Repository<PaymentTransaction>,
    ) { }

    async initializePayment(userId: string, dto: CreatePaymentDto) {
        try {
            const reference = `TXN_${Date.now()}`;

            const payment = this.paymentsRepo.create({
                user: { id: userId } as any,
                amount: dto.amount,
                metadata: {
                    productId: dto.productId,
                    cartId: dto.cartId,
                },
                reference,
                status: TransactionStatus.Pending,
            });

            await this.paymentsRepo.save(payment);

            return {
                reference,
                amount: dto.amount,
                status: TransactionStatus.Pending,
            };
        } catch (error: any) {
            this.logger.error('Error initializing payment', error.message);
            throw new BadRequestException('Unable to initialize payment');
        }
    }

    async updatePaymentStatus(reference: string, status: TransactionStatus) {
        const transaction = await this.paymentsRepo.findOne({ where: { reference } });
        if (!transaction) {
            throw new BadRequestException('Transaction not found');
        }
        transaction.status = status;
        await this.paymentsRepo.save(transaction);
        return transaction;
    }

    async fetchTransactions(pageOptions: PageOptionsDto) {
        const { page = 1, take = 50 } = pageOptions;

        const [items, total] = await this.paymentsRepo.findAndCount({
            skip: (page - 1) * take,
            take,
            order: { createdAt: 'DESC' },
        });

        return {
            items,
            total,
            page,
            perPage: take,
        };
    }

    async getTransactionTotals() {
        const totalCount = await this.paymentsRepo.count();
        const totalAmountResult = await this.paymentsRepo
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'sum')
            .getRawOne();

        return {
            totalCount,
            totalAmount: Number(totalAmountResult.sum || 0),
        };
    }
}



