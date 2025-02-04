import { Module } from '@nestjs/common';
import { AdminModule } from 'danimai-admin';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfigFactory } from './database/typeorm.factory';
import dataSource from 'ormconfig';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Group } from './entities/group.entity';
import { Permission } from './entities/permission.entity';
import { Session } from './entities/session.entity';
import { Token } from './entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfigFactory,
    }),
    AdminModule.register({
      dataSource: dataSource as any,
      appEntities: {
        user: User,
        group: Group,
        permission: Permission,
        session: Session,
        token: Token,
      },
    }),
    ConfigModule.forRoot(),
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
