import { BaseEntity } from 'src/entities';

export abstract class GroupAbstract extends BaseEntity {
  name: string;
  description: string;
}
