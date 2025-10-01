import { Column, Entity, Index } from 'typeorm';
import { Base } from './base.entity';
import { AnalyticsType } from 'src/common/enums/payment.enum';

@Entity({ name: 'campaign_analytics' })
export class CampaignAnalytics extends Base {
    @Column({ type: 'uuid', nullable: true })
    participantId: string;

    @Index()
    @Column({ type: 'varchar' })
    type: AnalyticsType;

    @Index()
    @Column({ type: 'uuid' })
    userId: string;
}