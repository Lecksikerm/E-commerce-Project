import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { ColumnNumericTransformer } from 'src/core/utils/transformer';
import { PaymentTransaction } from './payment-transaction.entity';

@Entity({ name: 'plans' })
export class Plan extends Base {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'jsonb', nullable: true })
  descriptions: string[];

  @Column({
    default: 0,
    type: 'decimal',
    precision: 30,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @OneToMany(() => PaymentTransaction, (t) => t.plan)
  transactions: PaymentTransaction[];
}