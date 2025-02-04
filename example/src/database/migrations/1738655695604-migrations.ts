import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1738655695604 implements MigrationInterface {
    name = 'Migrations1738655695604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_da1a6a4fc2bced49477262cfd41"`);
        await queryRunner.query(`CREATE TABLE "posts_users_users" ("postsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_0f373e785d2a0032014f4b5127a" PRIMARY KEY ("postsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dc17d6a0d3e6969076195a0ac6" ON "posts_users_users" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a719cd3ead249ea1f288b7e3aa" ON "posts_users_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "usersId"`);
        await queryRunner.query(`ALTER TABLE "posts_users_users" ADD CONSTRAINT "FK_dc17d6a0d3e6969076195a0ac63" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_users_users" ADD CONSTRAINT "FK_a719cd3ead249ea1f288b7e3aa5" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts_users_users" DROP CONSTRAINT "FK_a719cd3ead249ea1f288b7e3aa5"`);
        await queryRunner.query(`ALTER TABLE "posts_users_users" DROP CONSTRAINT "FK_dc17d6a0d3e6969076195a0ac63"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "usersId" integer NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a719cd3ead249ea1f288b7e3aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc17d6a0d3e6969076195a0ac6"`);
        await queryRunner.query(`DROP TABLE "posts_users_users"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_da1a6a4fc2bced49477262cfd41" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
