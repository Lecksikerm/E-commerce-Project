import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from './base.entity'; // path to your Base class
import { Product } from './product.entity';

@Entity('categories')
export class Category extends Base {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
