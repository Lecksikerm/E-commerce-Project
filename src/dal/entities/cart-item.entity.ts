import { Entity, ManyToOne, Column } from 'typeorm';
import { Base } from './base.entity';
import { Cart } from './cart.entity';
import { Product } from '../../dal/entities/product.entity';

@Entity()
export class CartItem extends Base {
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;
}
