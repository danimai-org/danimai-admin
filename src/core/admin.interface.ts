import type { PaginateConfig } from 'nestjs-paginate';
import { EntityType } from 'src/types';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';

export type KeyOfEntity<T extends EntityType> = keyof {
  [P in keyof InstanceType<T> as InstanceType<T>[P] extends T ? P : never]: any;
};

export type RelationPagination<T extends EntityType> = {
  [R in KeyOfEntity<T>]: PaginateConfig<InstanceType<T>[R]>;
};

export interface AdminSectionConfig<T extends EntityType> {
  entity: T;
  service?: typeof BaseService<T>;
}

export interface AdminSection<T extends EntityType> {
  entity: T;
  repository: Repository<InstanceType<T>>;
  service: BaseService<T>;
  dataSource: DataSource;
}
