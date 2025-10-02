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
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiOkResponse,
    ApiBody,
} from '@nestjs/swagger';
import { PaymentService } from './services/payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaystackWebhookDto } from './dto/paystack.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionTotalsDto } from './dto/transaction-totals.dto';
import { PaystackTransactionDto } from './dto/paystack-transactions.dto';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from 'src/admin/admin.guard';
import { PageOptionsDto } from 'src/auth/dto/page-options.dto';
import { PaystackService } from './services/paystack.service';
import { Request } from 'express';
import { Any } from 'typeorm';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly paystackService: PaystackService,
        private readonly configService: ConfigService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('user-token')
    @Post('/initiate')
    @ApiOperation({ summary: 'Initiate a payment' })
    @ApiResponse({ status: 201, type: PaymentResponseDto })
    async initiatePayment(
        @Req() req: Request & { user: any },
        @Body() dto: CreatePaymentDto,
    ) {
        const userId = req.user.id;

        const payload = {
            ...dto,
            email: req.user.email,
            redirectUrl: this.configService.get('PAYSTACK_REDIRECT_URL'),
        };

        return this.paymentService.paystack(userId, payload);
    }

    @Get('verify/:reference')
    @ApiOperation({ summary: 'Verify a payment by reference' })
    @ApiResponse({ status: 200, type: PaymentResponseDto })
    async verifyPayment(@Param('reference') reference: string) {
        return this.paystackService.verifyPayment(reference);
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
        if (!req.rawBody) {
            console.error('Webhook rawBody is missing');
            return { message: 'Invalid request: no raw body received' };
        }

        return this.paystackService.handleWebhook(signature, req.rawBody);
    }


    @ApiOkResponse({ type: TransactionTotalsDto })
    @Get('/totals')
    @UseGuards(AdminGuard)
    @ApiBearerAuth('admin-token')
    async getTransactionTotals() {
        return this.paymentService.getTransactionTotals();
    }

    @ApiOkResponse({ type: [PaystackTransactionDto] })
    @Get('/transactions')
    @UseGuards(AdminGuard)
    @ApiBearerAuth('admin-token')
    async fetchTransactions(
        @Query(new ValidationPipe({ transform: true })) pageOptions: PageOptionsDto,
    ) {
        return this.paymentService.fetchTransactions(pageOptions);
    }

}



