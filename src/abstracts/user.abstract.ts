import { RoleEnum } from 'src/entities';

export abstract class UserAbstract {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  groupId: number;
  emailVerifiedAt: Date;
  role: RoleEnum;
  previousPassword: string;

  setPassword: () => Promise<void>;
  comparePassword: (password: string) => boolean;
}
