import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentTransaction } from '../dal/entities/payment-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule { }
