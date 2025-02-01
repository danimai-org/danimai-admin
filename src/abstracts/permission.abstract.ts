import { PermissionEnum } from 'src/entities';

export abstract class PermissionAbstract {
  section: string;
  permission: PermissionEnum;
  groupId: number;
}
