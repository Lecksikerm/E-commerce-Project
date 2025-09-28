import { Entity, ManyToOne, OneToMany, Column } from 'typeorm';
import { Base } from './base.entity';
import { CartItem } from './cart-item.entity';
import { User } from './user.entity'; 

@Entity({ name: 'carts' })
export class Cart extends Base {
  @ManyToOne(() => User, (user) => user.carts, { eager: true }) 
  user: User;

  @Column({ default: 'active' })
  status: 'active' | 'checked_out';

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true, eager: true })
  items: CartItem[];
}

