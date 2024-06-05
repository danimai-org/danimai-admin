import { Group, Permission, Session, Token, User } from 'src/entities';

export interface AppEntities {
  user: typeof User;
  group: typeof Group;
  permission: typeof Permission;
  session: typeof Session;
  token: typeof Token;
}
export interface AdminAppConfigurationOptions {
  connection?: string;
}
