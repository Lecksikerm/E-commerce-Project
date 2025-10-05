import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaystackService } from './services/paystack.service';

@Module({
  imports: [ConfigModule], 
  providers: [PaystackService],
  exports: [PaystackService], 
})
export class PaystackModule {}
