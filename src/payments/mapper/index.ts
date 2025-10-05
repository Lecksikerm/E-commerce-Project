import { Transaction } from 'typeorm';
import { BaseTransactionDto } from '../dto/paystack.dto';
export const mapUserTxToResponse = (data: any): BaseTransactionDto => ({

  id: data.id,
  ref: data.ref,
  amount: data.amount,
  currency: data.currency,
  status: data.Status,
  createdAt: data.createdAt,
  userId: data.userId,
  productId: data.productId,
});