import { Entity, Column } from 'typeorm';

import { Base } from '../entities/base.entity';

@Entity('admin')
export class Admin extends Base {
  @Column({ unique: true })
    email!: string;

  @Column({ unique: true })
    name!: string;

  @Column()
    password!: string;
}


