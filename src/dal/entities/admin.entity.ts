import { Entity, Column } from 'typeorm';

import { Base } from './base.entity';

@Entity('admin')
export class Admin extends Base {
  @Column({ unique: true })
  email: string | undefined;

  @Column({ unique: true })
  name: string;

  @Column({ select: false })
  password!: string;
  products: any;
}


