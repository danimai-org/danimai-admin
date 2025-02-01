import { PermissionEnum } from 'src/entities';
import { GroupAbstract } from './group.abstract';

export abstract class PermissionAbstract {
  section: string;
  permission: PermissionEnum;
  group: GroupAbstract;
}
