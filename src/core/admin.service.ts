import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ADMIN_DATASOURCE } from './constants';
import { createPaginateConfig, createValidationSchema } from './service.helper';
import { EntityType } from 'src/types';
import {
  AdminSection,
  AdminSectionConfig,
  RelationPagination,
} from './admin.interface';
import { BaseService } from './base.service';

@Injectable()
export class AdminService {
  sections: Map<string, AdminSection<any>> = new Map();

  constructor(
    @Inject(ADMIN_DATASOURCE)
    private dataSource: DataSource,
  ) {}

  getRepository<T extends EntityType>(section: AdminSectionConfig<T>) {
    return this.dataSource.getRepository<InstanceType<T>>(section.entity);
  }

  registerSection<T extends EntityType>(
    name: string,
    _section: AdminSectionConfig<T>,
  ) {
    const section = this.setupSection(_section);
    this.sections.set(name, section);
  }

  setupSection<T extends EntityType>(
    section: AdminSectionConfig<T>,
  ): AdminSection<T> {
    const { columns, relations } = this.dataSource.getMetadata(section.entity);

    return {
      ...section,
      paginatedConfig: section.paginatedConfig || createPaginateConfig(columns),
      relations:
        Array.isArray(section.relations) || !section.relations
          ? relations
              .filter((relation) =>
                Array.isArray(section.relations)
                  ? section.relations.includes(relation.propertyName as any)
                  : true,
              )
              .reduce((acc, relation) => {
                const { columns } = this.dataSource.getMetadata(
                  relation.target,
                );
                return {
                  ...acc,
                  [relation.propertyName]: createPaginateConfig(columns),
                };
              }, {} as RelationPagination<any>)
          : section.relations,
      createValidationSchema: createValidationSchema(columns),
      updateValidationSchema: createValidationSchema(columns, true),
      dataSource: this.dataSource,
      repository: this.getRepository(section),
      service: new BaseService(),
    };
  }

  getSection(name: string) {
    const section = this.sections.get(name);
    if (!section) {
      throw new NotFoundException('section not found.');
    }
    return section;
  }
}
