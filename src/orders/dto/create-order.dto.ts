import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID of the user placing the order' })
  @IsUUID('4', { message: 'Invalid user ID format' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({ description: 'Cart ID containing ordered items' })
  @IsUUID('4', { message: 'Invalid cart ID format' })
  @IsNotEmpty({ message: 'Cart ID is required' })
  cartId: string;

  @ApiProperty({ description: 'Total order amount' })
  @IsNumber({}, { message: 'Total amount must be a number' })
  @IsNotEmpty({ message: 'Total amount is required' })
  totalAmount: number;

  @ApiProperty({ description: 'Payment-transaction ID (optional)' })
  @IsUUID('4', { message: 'Invalid payment-tranaction ID format' })
  @IsOptional()
  paymentTransactionId?: string;
}
