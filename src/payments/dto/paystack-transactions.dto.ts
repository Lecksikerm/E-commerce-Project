import { ApiProperty } from '@nestjs/swagger';

export class PaystackTransactionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paid_at: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  channel: string;

  @ApiProperty()
  currency: string;

  @ApiProperty({ type: () => Object })
  customer: any;
}
