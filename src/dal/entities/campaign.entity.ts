import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'campaigns' })
export class Campaign extends Base {
    @Column({ type: 'varchar' })
    objective: string;

    @Column({ type: 'varchar' })
    targetAgeGroup: string;

    @Column({ type: 'varchar' })
    targetGender: string;

    @Column({ type: 'varchar' })
    targetLocation: string;

    @Column({ type: 'varchar' })
    targetInterest: string;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({ type: 'uuid' })
    planId: string;
}