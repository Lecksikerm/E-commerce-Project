import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TransactionStatus } from 'src/common/enums/payment.enum';

export class PaystackInitResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Authorization URL created' })
  message: string;

  @ApiProperty({
    example: {
      authorization_url: 'https://checkout.paystack.com/abc123',
      access_code: 'ACCESS_12345',
      reference: 'PSK_1693457821',
    },
  })
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export class PaystackVerifyResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Verification successful' })
  message: string;

  @ApiProperty({
    example: {
      id: 123456789,
      status: 'success',
      reference: 'PSK_1693457821',
      amount: 5000,
      currency: 'NGN',
      customer: {
        email: 'user@example.com',
      },
      paid_at: '2025-09-29T18:10:00.000Z',
    },
  })
  data: any;
}

export class BaseTransactionDto {
  id: string;
  ref: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: Date;
  userId: string;
  productId: string;
}

export class PaystackWebhookDto {
  @ApiProperty({ example: 'charge.success' })
  event: string;

  @ApiProperty({
    example: {
      reference: 'PSK_1693457821',
      status: 'success',
      amount: 700,
      currency: 'NGN',
      customer: { email: 'ademola@gmail.com' },
    },
  })
  data: {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    customer: { email: string };
  };
}
export type PaystackPayload = {
  email: string;
  amount: number;
  ref: string;
  redirectUrl: string;
  channels?: string[];
  planCode?: string;
  productId: string;
}
export type PaystackResponse = {
  id?: string;
  status: string;
  amount: number;
  message: string;
  fee?: number;
}
export class PaystackPaymentDtoDto {
  amount: number;
  redirectUrl: string;
  email: string;
  productId?: string;
}







