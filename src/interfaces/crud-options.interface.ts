import { EntityType } from '../types';

export interface CrudOptions<T extends EntityType> {
  entity: T;
}
