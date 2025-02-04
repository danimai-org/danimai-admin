import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ADMIN_DATASOURCE } from './constants';
import { EntityType } from 'src/types';
import { AdminSection, AdminSectionConfig } from './admin.interface';
import { BaseService } from 'src/base/base.service';

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
    return {
      ...section,
      repository: this.getRepository(section),
      dataSource: this.dataSource,
      service: section.service ? new section.service() : new BaseService(),
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
