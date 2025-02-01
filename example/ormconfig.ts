import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { entities } from 'src/entities';

dotenv.config();

export const configs: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: entities,
  migrations: [__dirname + '/src/database/migrations/*{.ts,.js}'],
  dropSchema: false,
  logging: false,
};
const dataSource = new DataSource(configs);

export default dataSource;
