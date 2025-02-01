import { PaginateConfig } from 'nestjs-paginate';
import { GroupAbstract } from 'src/abstracts';

export const groupPaginateConfig: PaginateConfig<GroupAbstract> = {
  sortableColumns: ['createdAt'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['name', 'description'],
  maxLimit: 50,
  defaultLimit: 10,
};
