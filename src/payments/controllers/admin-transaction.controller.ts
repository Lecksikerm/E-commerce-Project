import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { TransactionTotalsDto } from '../dto/transaction-totals.dto';
import { PaystackTransactionDto } from '../dto/paystack-transactions.dto';
import { PageOptionsDto } from 'src/auth/dto/page-options.dto';
import { AdminGuard } from 'src/admin/admin.guard';

@ApiTags('Payments')
@Controller('v1/payments')
export class AdminTransactionController {
  constructor(private readonly paymentService: PaymentService) {}

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
    @Query(new ValidationPipe({ transform: true }))
    pageOptions: PageOptionsDto,
  ) {
    return this.paymentService.fetchTransactions(pageOptions);
  }
}
