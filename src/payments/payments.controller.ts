import {
    Controller,
    Post,
    Body,
    Param,
    Req,
    Headers,
    UseGuards,
    HttpCode,
    Get,
    Query,
    Res,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiOkResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaystackWebhookDto } from './dto/paystack.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { TransactionTotalsDto } from './dto/transaction-totals.dto';
import { PaystackTransactionDto } from './dto/paystack-transactions.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly configService: ConfigService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('user-token')
    @Post('/initialize')
    @ApiOperation({ summary: 'Initialize a payment' })
    @ApiResponse({ status: 201, type: PaymentResponseDto })
    async initializePayment(@Req() request: Request, @Body() dto: CreatePaymentDto) {
        console.log('PAYSTACK_BASE_URL:', this.configService.get('PAYSTACK_BASE_URL'));
        console.log('BACKEND_URL:', this.configService.get('BACKEND_URL'));

        return this.paymentsService.initializePayment((request as any).user.id, dto);
    }

    @Post('verify/:reference')
    @ApiOperation({ summary: 'Verify a payment by reference' })
    async verifyPayment(@Param('reference') reference: string) {
        return this.paymentsService.verifyPayment(reference);
    }

    @Post('/webhook')
    @HttpCode(200)
    @ApiOperation({ summary: 'Paystack webhook endpoint (for payment status updates)' })
    @ApiResponse({ status: 200, description: 'Acknowledges receipt of webhook' })
    async handleWebhook(
        @Headers('x-paystack-signature') signature: string,
        @Body() payload: PaystackWebhookDto,
    ) {
        console.log(payload);
        return this.paymentsService.handleWebhook(signature, payload);
    }

   @Get('/callback')
@ApiOperation({ summary: 'Paystack callback URL (user is redirected here after payment)' })
async paymentCallback(
  @Query('reference') reference: string,
  @Res() res: Response,
) {
  const result = await this.paymentsService.handleCallback(reference);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
  return res.redirect(
    `${frontendUrl}/payment-status?status=${result.status}&reference=${result.reference}`,
  );

 }

    @ApiOkResponse({ type: TransactionTotalsDto })
    @Get('/totals')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('admin-token')
    async getTransactionTotals() {
        return this.paymentsService.getTransactionTotals();
    }

    @ApiOkResponse({ type: [PaystackTransactionDto] })
    @Get('transactions')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('admin-token')
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'perPage', required: false, example: 50 })
    async fetchTransactions(
        @Query('page') page?: number,
        @Query('perPage') perPage?: number,
    ) {
        return this.paymentsService.fetchTransactions(page, perPage);
    
}
}
