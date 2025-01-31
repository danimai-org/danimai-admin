import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { ColumnType } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { z, ZodObject, ZodRawShape } from 'zod';

const TextType: ColumnType[] = ['varchar', 'text', 'enum'];
const NumberType: ColumnType[] = [
  'int',
  'int2',
  'int4',
  'int8',
  'int64',
  'integer',
  'decimal',
  'double',
  'double precision',
];
const DateType: ColumnType[] = [
  'timestamp',
  'date',
  'timestamptz',
  'timestamp with time zone',
];

const BooleanType: ColumnType[] = ['bool', 'boolean'];

const excludeColumns = ['id', 'createdAt', 'updatedAt', 'deletedAt'];

export function createPaginateConfig(
  columns: ColumnMetadata[],
  select?: PaginateConfig<any>['select'],
  defaultFilters: PaginateConfig<any>['filterableColumns'] = {},
  includeFilterColumns?: string[],
  excludeFilterColumns?: string[],
): PaginateConfig<any> {
  select = select?.length ? select : undefined;

  const filterableColumns: PaginateConfig<any>['filterableColumns'] = {};
  const sortableColumns: PaginateConfig<any>['sortableColumns'] = [];
  const searchableColumns: PaginateConfig<any>['searchableColumns'] = [];

  for (const column of columns) {
    sortableColumns.push(column.propertyName);

    if (select?.length && !select.includes(column.propertyName)) {
      continue;
    } else if (
      includeFilterColumns?.length &&
      !includeFilterColumns.includes(column.propertyName)
    ) {
      continue;
    } else if (
      excludeFilterColumns?.length &&
      excludeFilterColumns.includes(column.propertyName)
    ) {
      continue;
    }

    if (TextType.includes(column.type as any)) {
      searchableColumns.push(column.propertyName);
      filterableColumns[column.propertyName] = [
        FilterOperator.EQ,
        FilterOperator.CONTAINS,
        FilterOperator.ILIKE,
      ];
    }

    if ([...NumberType, ...DateType].includes(column.type as any)) {
      filterableColumns[column.propertyName] = [
        FilterOperator.GTE,
        FilterOperator.LTE,
        FilterOperator.LT,
        FilterOperator.GT,
        FilterOperator.EQ,
      ];
    }
  }
  return {
    defaultLimit: 10,
    searchableColumns,
    filterableColumns: {
      ...filterableColumns,
      ...defaultFilters,
    },
    select,
    sortableColumns,
    defaultSortBy: [['createdAt', 'DESC']],
  };
}

export function createValidationSchema(
  columns: ColumnMetadata[],
  patch = false,
): ZodObject<any> {
  const validationObject = {} as ZodRawShape;

  for (const column of columns) {
    if (excludeColumns.includes(column.propertyName)) {
      continue;
    }

    if (TextType.includes(column.type as any)) {
      validationObject[column.propertyName] = z.string();
    }

    if (NumberType.includes(column.type as any)) {
      validationObject[column.propertyName] = z.number();
    }

    if (DateType.includes(column.type as any)) {
      validationObject[column.propertyName] = z.string().datetime();
    }

    if (BooleanType.includes(column.type as any)) {
      validationObject[column.propertyName] = z.boolean();
    }

    if (column.type === 'uuid') {
      validationObject[column.propertyName] = z.string().uuid();
    }

    if (column.isNullable || patch) {
      validationObject[column.propertyName] =
        validationObject[column.propertyName].optional();
    }
  }
  return z.object(validationObject);
}

export function parseValidation(
  dto: Record<string, any>,
  schema: ZodObject<any>,
) {
  const result = schema.safeParse(dto);
  return result.error;
}
