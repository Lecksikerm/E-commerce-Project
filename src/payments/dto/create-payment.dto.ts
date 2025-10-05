import { IsNotEmpty, IsNumber, IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 5000, description: 'Amount in kobo (e.g., 5000 = NGN 50)' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'uuid-of-product', required: false })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 'uuid-of-cart', required:false })
  @IsNotEmpty()
  @IsOptional()
  @IsUUID()
  cartId?: string;
}
