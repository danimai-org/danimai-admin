import {
  GroupAbstract,
  PermissionAbstract,
  SessionAbstract,
  TokenAbstract,
  UserAbstract,
} from 'src/abstracts';

export interface AppEntities {
  user: typeof UserAbstract;
  group: typeof GroupAbstract;
  permission: typeof PermissionAbstract;
  session: typeof SessionAbstract;
  token: typeof TokenAbstract;
}
export interface AdminAppConfigurationOptions {
  connection?: string;
}
