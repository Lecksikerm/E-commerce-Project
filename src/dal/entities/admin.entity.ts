import { Entity, Column } from 'typeorm';

import { Base } from './base.entity';
import { Exclude } from 'class-transformer';

@Entity('admin')
export class Admin extends Base {
  @Column({ unique: true })
  email: string | undefined;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password!: string;

  products: any;
  static id: any;
}


