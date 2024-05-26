import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { EntityType } from 'src/types';
import { DataSource, FindOneOptions, FindOptionsRelations } from 'typeorm';
import { ADMIN_DATASOURCE } from './constants';

interface AdminSection<T = EntityType> {
  paginatedConfig: PaginateConfig<T>;
  entity: T;
  relations?: FindOptionsRelations<T>;
  getOneFindOptions: FindOneOptions;
}

@Injectable()
export class AdminService {
  sections: Map<string, AdminSection> = new Map();
  dataSource: DataSource;

  constructor(
    @Inject(ADMIN_DATASOURCE)
    dataSource: DataSource,
  ) {
    this.dataSource = dataSource;
  }

  getRepository(section: string) {
    return this.dataSource.getRepository<any>(
      this.sections.get(section).entity,
    );
  }

  registerSection(name: string, section: AdminSection) {
    this.sections.set(name, section);
  }

  getSection(name: string, entity: string) {
    const section = this.sections.get(name);
    if (!section) {
      throw new NotFoundException('section not found.');
    }
    if (section.entity.name !== entity) {
      throw new NotFoundException('entity not found.');
    }
    return section;
  }

  async getAll(sectionName: string, entityName: string, query: PaginateQuery) {
    const section = this.getSection(sectionName, entityName);
    const repository = this.getRepository(sectionName);

    return paginate(query, repository, section.paginatedConfig);
  }

  async getOne(sectionName: string, entityName: string, id: string) {
    const section = this.getSection(sectionName, entityName);
    const repository = this.getRepository(sectionName);

    return repository.findOne({
      ...section.getOneFindOptions,
      where: {
        id,
      },
    });
  }

  async create(
    sectionName: string,
    entityName: string,
    createDto: Record<string, any>,
  ) {
    const repository = this.getRepository(sectionName);
    return repository.save(createDto);
  }

  async update(
    sectionName: string,
    entityName: string,
    id: string,
    updateDto: Record<string, any>,
  ) {
    const repository = this.getRepository(sectionName);

    const entity = await repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`${entityName} not found.`);
    }
    await repository.update({ id }, updateDto);

    return { ...entity, updateDto };
  }

  async delete(sectionName: string, entityName: string, id: string) {
    const repository = this.getRepository(sectionName);

    const entity = await repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`${entityName} not found.`);
    }

    await repository.delete({ id });
  }
}
