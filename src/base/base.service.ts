import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { EntityType } from 'src/types';
import { FindOptionsWhere, QueryRunner } from 'typeorm';
import { AdminSection, RelationPagination } from '../core/admin.interface';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  createPaginateConfig,
  createValidationSchema,
  parseValidation,
  validateRelation,
} from '../core/service.helper';
import { ZodObject } from 'zod';
import { CreateOneOptions, FindOneBaseOptions } from './base.interface';
import { BaseEntity } from 'src/entities';

export class BaseService<Entity extends EntityType> {
  paginatedConfig?: PaginateConfig<InstanceType<Entity>>;
  relations?: RelationPagination<Entity>;
  createColumns?: string[];
  updateColumns?: string[];
  getOneColumns?: string[];
  createValidationSchema?: ZodObject<any>;
  updateValidationSchema?: ZodObject<any>;
  createOneOptions: CreateOneOptions;
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
      loadRelationIds: true,
      ...this.findOneOptions,
      where: {
        id,
        ...this.findOneOptions.where,
      } as FindOptionsWhere<InstanceType<Entity>>,
    });
  }

  async createOneValidate(
    section: AdminSection<Entity>,
    createDto: InstanceType<Entity>,
  ): Promise<BaseEntity> {
    const queryRunner = section.dataSource.createQueryRunner();
    try {
      const { columns, relations } = section.dataSource.getMetadata(
        section.entity,
      );
      const validationSchema =
        this.createValidationSchema ||
        createValidationSchema([...columns, ...relations]);
      const { error, data } = parseValidation(createDto, validationSchema);

      if (error) {
        throw new UnprocessableEntityException(error.issues);
      }

      const { relationErrors, data: dataWithRelations } =
        await validateRelation(data, relations, queryRunner);

      if (relationErrors.length) {
        throw new UnprocessableEntityException(relationErrors);
      }

      const instance = queryRunner.manager
        .getRepository(section.entity)
        .create(dataWithRelations as InstanceType<Entity>);
      await queryRunner.release();
      return instance;
    } catch (error) {
      await queryRunner.release();
      throw error;
    }
  }

  async createOne(
    section: AdminSection<Entity>,
    createDto: InstanceType<Entity>,
  ) {
    const instance = await this.createOneValidate(section, createDto);
    return instance.save();
  }

  async updateOneValidate(
    section: AdminSection<Entity>,
    updateDto: InstanceType<Entity>,
    queryRunner: QueryRunner,
  ) {
    const { columns, relations } = section.dataSource.getMetadata(
      section.entity,
    );
    const validationSchema =
      this.createValidationSchema ||
      createValidationSchema([...columns, ...relations], true);
    const { error, data } = parseValidation(updateDto, validationSchema);

    if (error) {
      throw new UnprocessableEntityException(error.issues);
    }

    const { relationErrors, data: dataWithRelations } = await validateRelation(
      data,
      relations,
      queryRunner,
    );

    if (relationErrors.length) {
      throw new UnprocessableEntityException(relationErrors);
    }

    const instance = queryRunner.manager
      .getRepository(section.entity)
      .create(dataWithRelations as InstanceType<Entity>);
    return instance;
  }

  async updateOne(
    section: AdminSection<Entity>,
    id: number,
    updateDto: InstanceType<Entity>,
  ) {
    const queryRunner = section.dataSource.createQueryRunner();
    try {
      const instance = await this.updateOneValidate(
        section,
        updateDto,
        queryRunner,
      );

      const entity = await section.repository.findOneBy({
        id,
      } as FindOptionsWhere<InstanceType<Entity>>);

      if (!entity) {
        throw new NotFoundException(`${section.entity.name} not found.`);
      }

      instance.id = entity.id;
      await instance.save();
      await queryRunner.release();
      return instance;
    } catch (error) {
      await queryRunner.release();
      throw error;
    }
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
