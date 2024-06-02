import { DataSource, DeepPartial } from 'typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAppConfigurationOptions } from './admin.config';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ADMIN_CONFIG, ADMIN_DATASOURCE, ADMIN_SERVICE } from './constants';
import { getStaticControllers, getStaticProviders } from './admin.util';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigClass } from 'src/mail/mailerConfig.service';

export interface AdminCoreModuleConfig {
  adminService?: typeof AdminService;
  adminController?: typeof AdminController;
  appConfig?: DeepPartial<AdminAppConfigurationOptions>;
  dataSource: DataSource;
}

@Global()
@Module({})
export class AdminModule {
  static async register(config: AdminCoreModuleConfig): Promise<DynamicModule> {
    if (!config.adminController) {
      config.adminController = AdminController;
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
