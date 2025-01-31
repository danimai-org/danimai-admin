import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1717509900182 implements MigrationInterface {
    name = 'Migrations1717509900182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_0ce20ad956af3961df1ff12d0c5"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_0ce20ad956af3961df1ff12d0c5" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_0ce20ad956af3961df1ff12d0c5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_0ce20ad956af3961df1ff12d0c5" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
