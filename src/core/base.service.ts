import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { EntityType } from 'src/types';
import {
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';
import { AdminSection } from './admin.interface';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { parseValidation } from './service.helper';

export class BaseService<Entity extends EntityType> {
  paginatedConfig?: PaginateConfig<Entity>;
  relations?: FindOptionsRelations<Entity> = {};
  getOneFindOptions?: FindOneOptions<Entity> = {};
  createColumns?: string[];
  updateColumns?: string[];
  getOneColumns?: string[];

  async getMany(section: AdminSection<Entity>, query: PaginateQuery) {
    const queryBuilder = section.repository.createQueryBuilder();
    return paginate(query, queryBuilder, section.paginatedConfig);
  }

  async getAllRelation(
    section: AdminSection<Entity>,
    relationProperty: string,
    query: PaginateQuery,
  ) {
    const paginatedConfig = Object.hasOwn(
      section?.relations || {},
      relationProperty,
    )
      ? section?.relations[relationProperty]
      : null;

    if (!paginatedConfig) {
      throw new NotFoundException('Invalid relation given.');
    }

    const queryBuilder = section.repository.createQueryBuilder();
    return paginate(query, queryBuilder, paginatedConfig);
  }

  async getOne(section: AdminSection<Entity>, id: number) {
    return section.repository.findOne({
      where: {
        id,
      } as FindOptionsWhere<InstanceType<Entity>>,
    });
  }

  async createOne(
    section: AdminSection<Entity>,
    createDto: InstanceType<Entity>,
  ) {
    // validate data
    const error = parseValidation(createDto, section.createValidationSchema);
    if (error) {
      throw new UnprocessableEntityException(error.issues);
    }

    return section.repository.save(createDto);
  }

  async updateOne(
    section: AdminSection<Entity>,
    id: number,
    updateDto: Record<string, any>,
  ) {
    // validate data
    const error = parseValidation(updateDto, section.updateValidationSchema);

    if (error) {
      throw new UnprocessableEntityException(error.issues);
    }

    const entity = await section.repository.findOneBy({
      id,
    } as FindOptionsWhere<InstanceType<Entity>>);

    if (!entity) {
      throw new NotFoundException(`${section.entity.name} not found.`);
    }

    await section.repository.update(id, updateDto);

    return { ...entity, updateDto };
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
