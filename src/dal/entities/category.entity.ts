import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Product } from './product.entity';
import { Admin } from './admin.entity';
import { Exclude } from 'class-transformer';

@Entity('categories')
export class Category extends Base {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  @Exclude() 
  createdBy: Admin;

  @Column({ type: 'uuid', nullable: true })
  @Exclude() 
  createdById?: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
