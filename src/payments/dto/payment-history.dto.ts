import { ApiProperty } from '@nestjs/swagger';

export class PaymentHistoryDto {
  @ApiProperty({ example: 'uuid', description: 'Transaction ID' })
  id: string;

  @ApiProperty({ example: 5000, description: 'Amount paid in kobo' })
  amount: number;

  @ApiProperty({ example: 'NGN', description: 'Currency' })
  currency: string;

  @ApiProperty({ example: 'success', description: 'Payment status' })
  status: string;

  @ApiProperty({ example: 'PSK_1632856478', description: 'Paystack reference' })
  reference: string;

  @ApiProperty({ example: '2025-09-28T17:00:00.000Z', description: 'Transaction date' })
  createdAt: Date;
}
