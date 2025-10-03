import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionStatus } from 'src/common/enums/payment.enum';

export class PaystackInitResponseData {
  @ApiProperty({ example: 'https://checkout.paystack.com/abc123' })
  @IsString()
  authorization_url: string;

  @ApiProperty({ example: 'ACCESS_12345' })
  @IsString()
  access_code: string;

  @ApiProperty({ example: 'PSK_1693457821' })
  @IsString()
  reference: string;
}

export class PaystackInitResponseDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ example: 'Authorization URL created' })
  @IsString()
  message: string;

  @ApiProperty({ type: PaystackInitResponseData })
  @ValidateNested()
  @Type(() => PaystackInitResponseData)
  data: PaystackInitResponseData;
}
export class PaystackVerifyResponseCustomer {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class PaystackVerifyResponseData {
  @ApiProperty({ example: 123456789 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'success' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'PSK_1693457821' })
  @IsString()
  reference: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'NGN' })
  @IsString()
  currency: string;

  @ApiProperty({ type: PaystackVerifyResponseCustomer })
  @ValidateNested()
  @Type(() => PaystackVerifyResponseCustomer)
  customer: PaystackVerifyResponseCustomer;

  @ApiProperty({ example: '2025-09-29T18:10:00.000Z' })
  @IsString()
  paid_at: string;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  fee?: number;

}

export class PaystackVerifyResponseDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  fee?: number;
}

export class BaseTransactionDto {
  @IsUUID()
  id: string;

  @IsString()
  ref: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @IsDate()
  createdAt: Date;

  @IsUUID()
  userId: string;

  @IsUUID()
  productId: string;
}

export class PaystackWebhookCustomer {
  @ApiProperty({ example: 'ademola@gmail.com' })
  @IsEmail()
  email: string;
}

export class PaystackWebhookData {
  @ApiProperty({ example: 'PSK_1693457821' })
  @IsString()
  reference: string;

  @ApiProperty({ example: 'success' })
  @IsString()
  status: string;

  @ApiProperty({ example: 700 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'NGN' })
  @IsString()
  currency: string;

  @ApiProperty({ type: PaystackWebhookCustomer })
  @ValidateNested()
  @Type(() => PaystackWebhookCustomer)
  customer: PaystackWebhookCustomer;
}

export class PaystackWebhookDto {
  @ApiProperty({ example: 'charge.success' })
  @IsString()
  event: string;

  @ApiProperty({ type: PaystackWebhookData })
  @ValidateNested()
  @Type(() => PaystackWebhookData)
  data: PaystackWebhookData;
}

// ---------- Payload ----------
export class PaystackPayloadDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'REF123' })
  @IsString()
  ref: string;

  @ApiProperty({ example: 'https://yourapp.com/callback' })
  @IsString()
  redirectUrl: string;

  @ApiProperty({ example: ['card', 'bank'], required: false })
  @IsOptional()
  @IsString({ each: true })
  channels?: string[];

  @ApiProperty({ example: 'PLN_xxx', required: false })
  @IsOptional()
  @IsString()
  planCode?: string;

  @ApiProperty({ example: 'uuid-of-product' })
  @IsUUID()
  productId: string;
}

export class PaystackResponseDto {
  @ApiProperty({ example: 'uuid', required: false })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'success' })
  @IsString()
  status: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Payment successful' })
  @IsString()
  message: string;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  fee?: number;
}

export class PaystackPaymentDto {
  @ApiProperty({ example: 5000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'https://yourapp.com/callback' })
  @IsString()
  redirectUrl: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'uuid-of-product', required: false })
  @IsUUID()
  productId: string;
}











