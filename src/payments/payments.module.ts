import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentTransaction } from '../dal/entities/payment-transaction.entity';
import { PaystackService } from './services/paystack.service';
import { ConfigModule } from '@nestjs/config';
import { PaystackModule } from './paystack.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction, ConfigModule, PaystackModule])],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaystackService],
  exports: [PaymentsService],
})
export class PaymentsModule { }
