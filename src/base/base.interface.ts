import { FindOneOptions } from 'typeorm';

export type FindOneBaseOptions<T> = Partial<
  Pick<
    FindOneOptions<T>,
    | 'select'
    | 'where'
    | 'relationLoadStrategy'
    | 'loadEagerRelations'
    | 'relations'
  >
>;
