import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1717403030119 implements MigrationInterface {
    name = 'Migrations1717403030119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(255) NOT NULL, "content" text NOT NULL, "isPublished" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
