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
    ApiBody,
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
import { AdminGuard } from 'src/admin/admin.guard';
import { PageOptionsDto } from 'src/auth/dto/page-options.dto';

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
    @ApiOperation({ summary: 'Paystack Webhook Handler' })
    @ApiBody({ type: PaystackWebhookDto })
    @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
    async handleWebhook(
        @Headers('x-paystack-signature') signature: string,
        @Req() req: any,
    ) {
        return this.paymentsService.handleWebhook(signature, req.rawBody);
    }


    @ApiOkResponse({ type: TransactionTotalsDto })
    @Get('/totals')
    @UseGuards(AdminGuard)
    @ApiBearerAuth('admin-token')
    async getTransactionTotals() {
        return this.paymentsService.getTransactionTotals();
    }

    @ApiOkResponse({ type: [PaystackTransactionDto] })
    @Get('/transactions')
    @UseGuards(AdminGuard)
    @ApiBearerAuth('admin-token')
    async fetchTransactions(
        @Query(new ValidationPipe({ transform: true })) pageOptions: PageOptionsDto,
    ) {
        return this.paymentsService.fetchTransactions(pageOptions);
    }

}
