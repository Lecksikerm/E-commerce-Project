import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { PaymentTransaction, User } from '../dal/entities/payment-transaction.entity';
import { PaystackService } from './services/paystack.service';
import { ConfigModule } from '@nestjs/config';
import { PaystackModule } from './paystack.module';
import { Product } from 'src/dal/entities';
import { AdminTransactionController } from './controllers/admin-transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, PaymentTransaction, ConfigModule, PaystackModule])],
  controllers: [PaymentController, AdminTransactionController],
  providers: [PaymentService, PaystackService],
  exports: [PaymentService],
})
export class PaymentModule { }
