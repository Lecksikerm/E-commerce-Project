import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentTransactionToOrders1760128678588 implements MigrationInterface {
    name = 'AddPaymentTransactionToOrders1760128678588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_06a051324c76276ca2a9d1feb08"`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "paymentId" TO "paymentTransactionId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_20047fb80dc08af215fe46a909c" FOREIGN KEY ("paymentTransactionId") REFERENCES "payment_transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_20047fb80dc08af215fe46a909c"`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "paymentTransactionId" TO "paymentId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_06a051324c76276ca2a9d1feb08" FOREIGN KEY ("paymentId") REFERENCES "payment_transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
