import { BaseEntity, RoleEnum } from 'src/entities';
import { GroupAbstract } from './group.abstract';

export abstract class UserAbstract extends BaseEntity {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  group: GroupAbstract;
  groupId: number;
  emailVerifiedAt: Date;
  role: RoleEnum;
  previousPassword: string;

  setPassword: () => Promise<void>;
  comparePassword: (password: string) => boolean;
}
