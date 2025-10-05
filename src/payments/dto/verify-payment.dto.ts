import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty({ example: 'PSK_1632856478', description: 'Paystack payment reference' })
  reference: string;

  @ApiProperty({ example: 'success', description: 'Payment status after verification' })
  status: string;
}
