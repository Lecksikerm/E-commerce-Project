import { ApiProperty } from '@nestjs/swagger';

export class TransactionTotalsDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Transaction totals' })
  message: string;

  @ApiProperty({
    example: {
      total_transactions: 42670,
      total_volume: 6617829946,
      total_volume_by_currency: [
        { currency: 'NGN', amount: 6617829946 },
        { currency: 'USD', amount: 28000 },
      ],
      pending_transfers: 6617829946,
      pending_transfers_by_currency: [
        { currency: 'NGN', amount: 6617829946 },
        { currency: 'USD', amount: 28000 },
      ],
    },
  })
  data: any;
}
