import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/entities';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
