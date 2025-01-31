import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1717610487962 implements MigrationInterface {
    name = 'Migrations1717610487962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "provider"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "provider" character varying NOT NULL DEFAULT 'EMAIL'`);
    }

}
