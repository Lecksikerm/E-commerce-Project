import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({ example: 'https://checkout.paystack.com/abc123', description: 'Paystack checkout URL' })
  authorization_url: string;

  @ApiProperty({ example: 'PSK_1632856478', description: 'Unique payment reference' })
  reference: string;

  @ApiProperty({ example: 'pending', description: 'Payment status' })
  status: string;
}
