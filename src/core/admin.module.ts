import { DataSource, DeepPartial } from 'typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAppConfigurationOptions } from './admin.config';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ADMIN_CONFIG, ADMIN_DATASOURCE, ADMIN_SERVICE } from './constants';

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
      controllers: [config.adminController],
      providers,
      exports: providers,
    };
  }
}
