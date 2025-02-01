import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export const configs: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/database/migrations/*{.ts,.js}'],
  dropSchema: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};
const dataSource = new DataSource(configs);

export default dataSource;
