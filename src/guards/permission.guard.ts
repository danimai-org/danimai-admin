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
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PermissionGuard implements CanActivate {
  permissionRepository: Repository<Permission>;

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

    const { section, id } = request.params;
    let permissionForRoute: PermissionEnum;
    const method = request.method;
    if (method === 'GET') {
      permissionForRoute = PermissionEnum.LIST_READ;
      if (id) {
        permissionForRoute = PermissionEnum.SINGLE_READ;
      }
    }
    if (method === 'POST') {
      permissionForRoute = PermissionEnum.CREATE;
    }
    if (method === 'PATCH') {
      permissionForRoute = PermissionEnum.UPDATE;
    }
    if (method === 'DELETE') {
      permissionForRoute = PermissionEnum.DELETE;
    }

    if (!permissionForRoute) {
      return false;
    }

    const permission = await this.permissionRepository.findOneBy({
      section,
      groupId: user.groupId,
      permission: permissionForRoute,
    });

    return !!permission;
  }
}
