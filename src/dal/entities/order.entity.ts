import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { PaymentTransaction, } from './payment-transaction.entity';
import { User } from './user.entity';
import { Cart } from './cart.entity';

@Entity('orders')
export class Order extends Base {
    @ManyToOne(() => User, (user) => user.orders, { eager: true })
    @JoinColumn()
    user: User;

    @ManyToOne(() => PaymentTransaction, { eager: true, nullable: true })
    @JoinColumn({ name: 'paymentTransactionId' })
    paymentTransaction: PaymentTransaction

    @ManyToOne(() => Cart, { eager: true })
    @JoinColumn()
    cart: Cart;

    @Column({ default: 'pending' })
    status: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
