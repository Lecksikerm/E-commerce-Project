import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Product } from './product.entity';
import { Cart } from './cart.entity';
import { PaymentTransaction } from './payment-transaction.entity';
import { Order } from './order.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends Base {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', default: 'user' })
  role: string;

  @OneToMany(() => Product, (product) => product.createdBy)
  products: Product[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => PaymentTransaction, (transaction) => transaction.user)
  transactions: PaymentTransaction[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

}














