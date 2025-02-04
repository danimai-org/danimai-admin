import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { ColumnType, In, QueryRunner } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { z, ZodIssue, ZodObject, ZodRawShape } from 'zod';

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
  columns: (ColumnMetadata | RelationMetadata)[],
  patch = false,
): ZodObject<any> {
  const validationObject = {} as ZodRawShape;

  for (const column of columns) {
    const relationColumn = column as RelationMetadata;
    if (excludeColumns.includes(column.propertyName)) {
      continue;
    }

    if (relationColumn?.relationType) {
      if (relationColumn.relationType != 'many-to-many') {
        continue;
      }

      const columnType = (relationColumn.joinColumns?.[0].type as any).name;
      if (columnType === 'String') {
        validationObject[relationColumn.propertyName] = z
          .array(z.string())
          .optional();
      }

      if (columnType === 'Number') {
        validationObject[relationColumn.propertyName] = z
          .array(z.number())
          .optional();
      }
      continue;
    }

    if (
      TextType.includes(column.type as any) ||
      (column.type as any)?.name === 'String'
    ) {
      validationObject[column.propertyName] = z.string();
    }

    if (
      NumberType.includes(column.type as any) ||
      (column.type as any)?.name === 'Number'
    ) {
      validationObject[column.propertyName] = z.number();
    }

    if (
      DateType.includes(column.type as any) ||
      (column.type as any)?.name === 'Date'
    ) {
      validationObject[column.propertyName] = z.string().datetime();
    }

    if (
      BooleanType.includes(column.type as any) ||
      (column.type as any)?.name === 'Boolean'
    ) {
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

export function parseValidation<T>(dto: T, schema: ZodObject<any>) {
  return schema.safeParse(dto);
}

export async function validateRelation(
  data: Record<string, any>,
  relations: RelationMetadata[],
  queryRunner: QueryRunner,
) {
  const relationErrors: Omit<ZodIssue, 'argumentsError'>[] = [];

  // Validate relations
  for (const relation of relations) {
    if (!Object.hasOwn(data, relation.propertyName)) {
      continue;
    }

    if (
      !(Array.isArray(data[relation.propertyName])
        ? data[relation.propertyName].length
        : data[relation.propertyName])
    ) {
      continue;
    }

    if (
      relation.relationType === 'many-to-one' ||
      relation.relationType === 'one-to-one'
    ) {
      const repository = queryRunner.manager.getRepository(
        relation.inverseEntityMetadata.name,
      );
      const existingInstance = await repository.findOneBy({
        id: data[relation.propertyName],
      });
      if (!existingInstance) {
        relationErrors.push({
          code: 'invalid_arguments',
          message: `${relation.propertyName} does not exists.`,
          path: [relation.propertyName],
        });
      }
    }
    if (relation.relationType === 'many-to-many') {
      const repository = queryRunner.manager.getRepository(
        relation.inverseEntityMetadata.name,
      );
      const existingInstances = await repository.findBy({
        id: In(data[relation.propertyName]),
      });

      if (
        existingInstances.length !== new Set(data[relation.propertyName]).size
      ) {
        relationErrors.push({
          code: 'invalid_arguments',
          message: `${relation.propertyName} ${data[relation.propertyName].filter((id) => !existingInstances.find((existingInstance) => existingInstance.id !== id))} do not exist.`,
          path: [relation.propertyName],
        });
      } else {
        data[relation.propertyName] = data[relation.propertyName].map((id) =>
          repository.create({ id }),
        );
      }
    }
  }

  return { relationErrors, data };
}
