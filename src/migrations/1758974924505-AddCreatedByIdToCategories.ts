import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedByIdToCategories1758974924505 implements MigrationInterface {
    name = 'AddCreatedByIdToCategories1758974924505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_a6ada6f4dcf60db496fe71d7a96" FOREIGN KEY ("createdById") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_a6ada6f4dcf60db496fe71d7a96"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdById"`);
    }

}
