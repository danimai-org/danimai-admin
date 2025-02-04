import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1738655617341 implements MigrationInterface {
    name = 'Migrations1738655617341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "userId" TO "usersId"`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "usersId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_da1a6a4fc2bced49477262cfd41" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_da1a6a4fc2bced49477262cfd41"`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "usersId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "usersId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
