import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ADMIN_DATASOURCE, ADMIN_SERVICE, AdminService } from 'src/core';
import { Permission } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  permissionRepository: Repository<Permission>;
  constructor(
    @Inject(ADMIN_DATASOURCE) dataSource: DataSource,
    @Inject(ADMIN_SERVICE)
    private adminService: AdminService,
  ) {
    this.permissionRepository = dataSource.getRepository(Permission);
  }

  async getByGroup(groupId: string) {
    return this.permissionRepository.find({
      where: {
        groupId,
      },
    });
  }

  async addPermissions(groupId: string, permissionDto: CreatePermissionDto) {
    const invalidSectionNames: string[] = [];
    const permissions: Permission[] = [];

    for (const permission of permissionDto.data) {
      if (!this.validateSection(permission.section)) {
        invalidSectionNames.push(permission.section);
      } else {
        permissions.push(
          ...permission.permissions.map((per) =>
            Permission.create({
              permission: per,
              groupId,
              section: permission.section,
            }),
          ),
        );
      }
    }
    if (!!invalidSectionNames.length) {
      throw new UnprocessableEntityException({
        message: 'Invalid section name given',
        data: invalidSectionNames,
      });
    }
    await this.permissionRepository.delete({ groupId });
    return this.permissionRepository.save(permissions);
  }

  validateSection(sectionName: string) {
    return this.adminService.sections.has(sectionName);
  }

  async delete(ids: string[]) {
    await this.permissionRepository.delete(ids);
  }
}
