import { DataSource, DeepPartial } from 'typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAppConfigurationOptions, AppEntities } from './admin.config';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  ADMIN_CONFIG,
  ADMIN_DATASOURCE,
  ADMIN_SERVICE,
  APP_ENTITIES,
} from './constants';
import { getStaticControllers, getStaticProviders } from './admin.util';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigClass } from 'src/mail/mailerConfig.service';
import { Group, Permission, Session, Token, User } from 'src/entities';

export interface AdminCoreModuleConfig {
  adminService?: typeof AdminService;
  adminController?: typeof AdminController;
  appConfig?: DeepPartial<AdminAppConfigurationOptions>;
  dataSource: DataSource;
  appEntities?: AppEntities;
}

@Global()
@Module({})
export class AdminModule {
  static async register(config: AdminCoreModuleConfig): Promise<DynamicModule> {
    if (!config.adminController) {
      config.adminController = AdminController;
    }

    if (!config.appEntities) {
      config.appEntities = {
        group: Group,
        permission: Permission,
        session: Session,
        token: Token,
        user: User,
      };
    }

    if (!config.appConfig) {
      config.appConfig = {
        connection: 'default',
      };
    }

    if (!config.adminService) {
      config.adminService = AdminService;
    }

    const providers: Provider[] = [
      {
        provide: ADMIN_SERVICE,
        useClass: config.adminService,
      },
      {
        provide: ADMIN_CONFIG,
        useValue: config.appConfig,
      },
      {
        provide: APP_ENTITIES,
        useValue: config.appEntities,
      },
      {
        provide: ADMIN_DATASOURCE,
        useValue: config.dataSource,
      },
    ];
    await config.dataSource.initialize();

    return {
      module: AdminModule,
      imports: [
        MailerModule.forRootAsync({
          useClass: MailerConfigClass,
        }),
        JwtModule.registerAsync({
          useFactory: async () => ({
            secret: process.env.AUTH_JWT_SECRET,
            signOptions: {
              expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN || '1d',
            },
          }),
        }),
      ],
      controllers: [config.adminController, ...getStaticControllers()],
      providers: [...providers, ...getStaticProviders()],
      exports: providers,
    };
  }
}
