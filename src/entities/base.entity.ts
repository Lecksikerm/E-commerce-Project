import {
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id?: string; // 👈 make optional
  
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date; // 👈 make optional

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date; // 👈 make optional
}

