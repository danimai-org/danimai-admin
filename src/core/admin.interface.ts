import { PaginateConfig } from 'nestjs-paginate';
import { EntityType } from 'src/types';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { ZodObject } from 'zod';
import { BaseService } from './base.service';

export type KeyOfEntity<T extends EntityType> = keyof {
  [P in keyof InstanceType<T> as InstanceType<T>[P] extends T ? P : never]: any;
};

export type RelationPagination<T extends EntityType> = {
  [R in KeyOfEntity<T>]: PaginateConfig<InstanceType<T>[R]>;
};

export interface AdminSectionConfig<T extends EntityType> {
  paginatedConfig?: PaginateConfig<InstanceType<T>>;
  entity: T;
  relations?: RelationPagination<T> | KeyOfEntity<T>[];
  getOneFindOptions?: FindOneOptions<InstanceType<T>>;
  service?: BaseService<T>;
}

export interface AdminSection<T extends EntityType> {
  paginatedConfig: PaginateConfig<InstanceType<T>>;
  entity: T;
  getOneFindOptions?: FindOneOptions;
  createValidationSchema: ZodObject<any>;
  updateValidationSchema: ZodObject<any>;
  relations?: RelationPagination<T>;
  repository: Repository<InstanceType<T>>;
  service: BaseService<T>;
  dataSource: DataSource;
}
