import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Admin } from './admin.entity';
import { Category } from './category.entity';

@Entity('products')
export class Product extends Base {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column({ type: 'text', nullable: true })
  img: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;


  @ManyToOne(() => Category, { nullable: true, eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'uuid', nullable: true })
  categoryId?: string;


  @ManyToOne(() => Admin, admin => admin.products, { eager: false })
  @JoinColumn({ name: 'createdById' })
  createdBy: Admin;
}




