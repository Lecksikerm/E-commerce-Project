import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('payment_transactions')
export class PaymentTransaction extends Base {
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column()
  amount: number;

  @Column({ default: 'NGN' })
  currency: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  reference: string;
  plan: any;

  @Column({ nullable: true })
  productId: string;

  @Column({ nullable: true })
  failureReason?: string

  @ManyToOne(() => Product, (product) => product.transactions, { eager: true })
  product: Product;
  channel: string;
}
export { User };

