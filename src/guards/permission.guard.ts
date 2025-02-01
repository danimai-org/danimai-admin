import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Request } from 'express';
import { ADMIN_DATASOURCE, APP_ENTITIES, AppEntities } from 'src/core';
import { Permission, PermissionEnum, RoleEnum, User } from 'src/entities';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class PermissionGuard implements CanActivate {
  private permissionRepository: Repository<Permission>;

  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
    @Inject(forwardRef(() => APP_ENTITIES))
    { permission }: AppEntities,
  ) {
    this.permissionRepository = dataSource.getRepository(permission);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const user = (request as any).user.user as User;

    if (user.role === RoleEnum.ADMIN) {
      return true;
    }

    const { section, id, relationProperty } = request.params;

    const permissionForRoute: PermissionEnum[] = [];

    const method = request.method;
    if (method === 'GET' && !relationProperty) {
      if (id) {
        permissionForRoute.push(PermissionEnum.SINGLE_READ);
      } else {
        permissionForRoute.push(PermissionEnum.LIST_READ);
      }
    }
    if (method === 'POST') {
      permissionForRoute.push(PermissionEnum.CREATE);
    }
    if (method === 'PATCH') {
      permissionForRoute.push(PermissionEnum.UPDATE);
    }
    if (method === 'DELETE') {
      permissionForRoute.push(PermissionEnum.DELETE);
    }

    if (method === 'GET' && relationProperty) {
      permissionForRoute.push(PermissionEnum.CREATE, PermissionEnum.UPDATE);
    }

    if (!permissionForRoute.length) {
      return false;
    }

    const permission = await this.permissionRepository.findOneBy({
      section,
      group: { id: user.groupId },
      permission: In(permissionForRoute),
    });

    return !!permission;
  }
}
