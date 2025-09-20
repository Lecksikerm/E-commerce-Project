import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.entity';
import { Product } from './product.entity';

@Entity({ name: 'users' })
export class User extends Base {
  @PrimaryGeneratedColumn('uuid') // Primary key
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ type: 'varchar', unique: true })
  username!: string;

  @Column({ type: 'varchar', default: 'user' })
  role!: string;

  @OneToMany(() => Product, (product) => product.createdBy)
  products!: Product[];
  userId: any;
}










              


