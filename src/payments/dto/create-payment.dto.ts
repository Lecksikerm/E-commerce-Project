import { IsNotEmpty, IsNumber, IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 5000, description: 'Amount in kobo (e.g., 5000 = NGN 50)' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email for Paystack payment' })
  @IsEmail()
  email: string;

  
  @ApiProperty({ example: 'f1d2d2f9-3b9b-4d0d-bc4b-53d6c3d9f4b7', required: false })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({ example: 'c3c5f6d1-2454-4c09-ae43-14bff3420e13', required: false })
  @IsOptional()
  @IsUUID()
  cartId?: string;
}
