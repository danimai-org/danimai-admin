import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from 'danimai-admin';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfigFactory } from './database/typeorm.factory';
import dataSource from 'ormconfig';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfigFactory,
    }),
    AdminModule.register({
      dataSource: dataSource as any,
    }),
    ConfigModule.forRoot(),
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
