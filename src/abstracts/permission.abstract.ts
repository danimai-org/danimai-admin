import { BaseEntity, PermissionEnum } from 'src/entities';
import { GroupAbstract } from './group.abstract';

export abstract class PermissionAbstract extends BaseEntity {
  section: string;
  permission: PermissionEnum;
  group: GroupAbstract;
}
