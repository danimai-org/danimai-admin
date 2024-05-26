import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from 'danimai-admin';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfigFactory } from './database/typeorm.factory';
import dataSource from 'ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfigFactory,
    }),
    AdminModule.register({
      dataSource,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
