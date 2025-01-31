import { PaginateConfig } from 'nestjs-paginate';
import { Group } from 'src/entities';

export const groupPaginateConfig: PaginateConfig<Group> = {
  sortableColumns: ['createdAt'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['name', 'description'],
  maxLimit: 50,
  defaultLimit: 10,
};
