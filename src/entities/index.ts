import { Group } from './group.entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';

export const EntityList = [User, Group, Permission];

export * from './group.entity';
export * from './user.entity';
export * from './permission.entity';
