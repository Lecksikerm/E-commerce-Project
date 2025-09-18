import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'users' })
export class User extends Base {
  @PrimaryGeneratedColumn()
  userId!: number; //  definite assignment

  @Column({ type: 'varchar', unique: true })
  email!: string; //  definite assignment

  @Column({ type: 'varchar' })
  password!: string; //  definite assignment

  @Column({ type: 'varchar', nullable: true })
  name?: string; // optional is fine, no need for !

  @Column({ type: 'varchar', unique: true })
  username!: string; //  definite assignment
}



              


