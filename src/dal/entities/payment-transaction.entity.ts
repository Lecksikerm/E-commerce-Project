import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

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
}
