import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { EntityType } from 'src/types';
import { FindOneOptions, FindOptionsRelations, Repository } from 'typeorm';
import { AdminSection } from './admin.service';

export class BaseService<Entity extends EntityType> {
  paginatedConfig?: PaginateConfig<Entity>;
  relations?: FindOptionsRelations<Entity> = {};
  getOneFindOptions?: FindOneOptions<Entity> = {};
  createColumns?: string[];
  updateColumns?: string[];
  getOneColumns?: string[];

  // Get one functions
  public getOne(repository: Repository<any>, id: string) {
    return repository.findOne({
      ...this.getOneFindOptions,
      where: {
        id,
      },
    });
  }

  public getMany(section: AdminSection<Entity>, query: PaginateQuery) {
    const queryBuilder = section.repository.createQueryBuilder();
    return paginate(query, queryBuilder, section.paginatedConfig);
  }

  // Get Many Filters
  public getFilters() {}

  // Create Many Functions
  public create() {}

  // Update One Functions
  public updateOne() {}

  // update Many Functions
  public updateMany() {}

  // Delete One Functions
  public deleteOne() {}

  // Delete Many Functions
  public deleteMany() {}
}
