import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './payment.controller';
import { PaymentTransaction, User } from '../dal/entities/payment-transaction.entity';
import { PaystackService } from './services/paystack.service';
import { ConfigModule } from '@nestjs/config';
import { PaystackModule } from './paystack.module';
import { Product } from 'src/dal/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User,Product,PaymentTransaction, ConfigModule, PaystackModule])],
  controllers: [PaymentController],
  providers: [PaymentService, PaystackService],
  exports: [PaymentService],
})
export class PaymentModule { }
