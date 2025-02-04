import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { EntityType } from 'src/types';
import { FindOptionsWhere } from 'typeorm';
import { AdminSection, RelationPagination } from '../core/admin.interface';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  createPaginateConfig,
  createValidationSchema,
  parseValidation,
} from '../core/service.helper';
import { ZodObject } from 'zod';
import { FindOneBaseOptions } from './base.interface';

export class BaseService<Entity extends EntityType> {
  paginatedConfig?: PaginateConfig<InstanceType<Entity>>;
  relations?: RelationPagination<Entity>;
  createColumns?: string[];
  updateColumns?: string[];
  getOneColumns?: string[];
  createValidationSchema?: ZodObject<any>;
  updateValidationSchema?: ZodObject<any>;
  findOneOptions: FindOneBaseOptions<InstanceType<Entity>> = {};

  async getMany(section: AdminSection<Entity>, query: PaginateQuery) {
    const { columns } = section.dataSource.getMetadata(section.entity);
    const queryBuilder = section.repository.createQueryBuilder();
    return paginate(
      query,
      queryBuilder,
      this.paginatedConfig ?? createPaginateConfig(columns),
    );
  }

  async getAllRelation(
    section: AdminSection<Entity>,
    relationProperty: string,
    query: PaginateQuery,
  ) {
    const { relations } = section.dataSource.getMetadata(section.entity);

    const relationPagination = relations.reduce((acc, relation) => {
      const { columns } = section.dataSource.getMetadata(relation.target);
      return {
        ...acc,
        [relation.propertyName]: createPaginateConfig(columns),
      };
    }, {} as RelationPagination<Entity>);

    const paginatedConfig = Object.hasOwn(
      relationPagination || {},
      relationProperty,
    )
      ? relationPagination[relationProperty]
      : null;

    if (!paginatedConfig) {
      throw new NotFoundException('Invalid relation given.');
    }

    const queryBuilder = section.repository.createQueryBuilder();
    return paginate(query, queryBuilder, paginatedConfig);
  }

  async getOne(section: AdminSection<Entity>, id: number) {
    return section.repository.findOne({
      ...this.findOneOptions,
      where: {
        id,
        ...this.findOneOptions.where,
      } as FindOptionsWhere<InstanceType<Entity>>,
    });
  }

  createOneValidate(
    section: AdminSection<Entity>,
    createDto: InstanceType<Entity>,
  ) {
    const { columns } = section.dataSource.getMetadata(section.entity);
    const validationSchema =
      this.createValidationSchema || createValidationSchema(columns);
    const error = parseValidation(createDto, validationSchema);
    if (error) {
      throw new UnprocessableEntityException(error.issues);
    }
    return section.repository.create(createDto);
  }

  async createOne(
    section: AdminSection<Entity>,
    createDto: InstanceType<Entity>,
  ) {
    const instance = this.createOneValidate(section, createDto);
    return instance.save();
  }

  updateOneValidate(
    section: AdminSection<Entity>,
    updateDto: InstanceType<Entity>,
  ) {
    const { columns } = section.dataSource.getMetadata(section.entity);
    const validationSchema =
      this.updateValidationSchema || createValidationSchema(columns, true);
    const error = parseValidation(updateDto, validationSchema);
    if (error) {
      throw new UnprocessableEntityException(error.issues);
    }
    return section.repository.create(updateDto);
  }

  async updateOne(
    section: AdminSection<Entity>,
    id: number,
    updateDto: InstanceType<Entity>,
  ) {
    const instance = this.updateOneValidate(section, updateDto);

    const entity = await section.repository.findOneBy({
      id,
    } as FindOptionsWhere<InstanceType<Entity>>);

    if (!entity) {
      throw new NotFoundException(`${section.entity.name} not found.`);
    }

    instance.id = id;
    return instance.save();
  }

  async deleteOne(section: AdminSection<Entity>, id: number) {
    const entity = await section.repository.findOneBy({
      id,
    } as FindOptionsWhere<InstanceType<Entity>>);

    if (!entity) {
      throw new NotFoundException(`${section.entity.name} not found.`);
    }

    await section.repository.delete(id);
  }

  // // Get Many Filters
  // public getFilters() {}

  // // update Many Functions
  // public updateMany() {}

  // // Delete Many Functions
  // public deleteMany() {}
}
