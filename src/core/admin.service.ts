import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { BaseEntity, DataSource, FindOneOptions } from 'typeorm';
import { ADMIN_DATASOURCE } from './constants';
import {
  createPaginateConfig,
  createValidationSchema,
  parseValidation,
} from './service.helper';
import { ZodObject } from 'zod';
import { EntityType } from 'src/types';

type KeyOfEntity<T extends EntityType> = keyof {
  [P in keyof InstanceType<T> as InstanceType<T>[P] extends BaseEntity
    ? P
    : never]: any;
};

type RelationPagination<T extends EntityType> = {
  [R in KeyOfEntity<T>]: PaginateConfig<InstanceType<T>[R]>;
};
interface AdminSectionConfig<T extends EntityType> {
  paginatedConfig?: PaginateConfig<InstanceType<T>>;
  entity: T;
  relations?: RelationPagination<T> | KeyOfEntity<T>[];
  getOneFindOptions?: FindOneOptions<InstanceType<T>>;
}

export interface AdminSection<T extends EntityType> {
  paginatedConfig: PaginateConfig<T>;
  entity: T;
  getOneFindOptions?: FindOneOptions;
  createValidationSchema: ZodObject<any>;
  updateValidationSchema: ZodObject<any>;
  relations?: RelationPagination<T>;
}

@Injectable()
export class AdminService {
  sections: Map<string, AdminSection<any>> = new Map();
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
    };
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
    const queryBuilder = repository.createQueryBuilder();
    return paginate(query, queryBuilder, section.paginatedConfig);
  }

  async getAllRelation(
    sectionName: string,
    entityName: string,
    relationProperty: string,
    query: PaginateQuery,
  ) {
    const section = this.getSection(sectionName, entityName);

    const paginatedConfig = Object.hasOwn(
      section?.relations || {},
      relationProperty,
    )
      ? section?.relations[relationProperty]
      : null;

    if (!paginatedConfig) {
      throw new NotFoundException('Invalid relation given.');
    }

    const repository = this.dataSource.getRepository(section.entity);

    const queryBuilder = repository.createQueryBuilder();
    return paginate(query, queryBuilder, paginatedConfig);
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
    const section = this.getSection(sectionName, entityName);

    // validate data
    const error = parseValidation(createDto, section.createValidationSchema);
    if (error) {
      throw new UnprocessableEntityException(error.issues);
    }

    return repository.save(createDto);
  }

  async update(
    sectionName: string,
    entityName: string,
    id: string,
    updateDto: Record<string, any>,
  ) {
    const repository = this.getRepository(sectionName);
    const section = this.getSection(sectionName, entityName);

    // validate data
    const error = parseValidation(updateDto, section.updateValidationSchema);

    if (error) {
      throw new UnprocessableEntityException(error.issues);
    }

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
