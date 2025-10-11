import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';
class Value {
  interests: string[] = [];
  gender: string[] = [];
  categories: string[] = [];
}

class ProductService {
  value: string | undefined;
  type: string | undefined; 
}

@Entity({ name: 'meta-data' })
export class MetaData extends Base {
  @Column({ type: 'varchar', unique: true })
  key: string;

  @Column({ type: 'jsonb' })
  value: Value;
}
