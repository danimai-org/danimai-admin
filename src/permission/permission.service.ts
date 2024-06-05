import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ADMIN_DATASOURCE, ADMIN_SERVICE, AdminService } from 'src/core';
import { Group, Permission } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateBulkPermissionDto } from './dto/create-bulk-permission.dto';
import { RemoveBulkPermissionDto } from './dto/remove-bulk-permission.dto';

@Injectable()
export class PermissionService {
  permissionRepository: Repository<Permission>;
  groupRepository: Repository<Group>;

  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE)) dataSource: DataSource,
    @Inject(forwardRef(() => ADMIN_SERVICE))
    private adminService: AdminService,
  ) {
    this.permissionRepository = dataSource.getRepository(Permission);
    this.groupRepository = dataSource.getRepository(Group);
  }

  async getByGroup(groupId: string) {
    return this.permissionRepository.find({
      where: {
        groupId,
      },
    });
  }

  async create(permissionDto: CreatePermissionDto) {
    const group = await this.groupRepository.findOneBy({
      id: permissionDto.groupId,
    });

    if (!group) {
      throw new UnprocessableEntityException({
        groupId: 'group does not exists.',
      });
    }

    if (!this.validateSection(permissionDto.section)) {
      throw new UnprocessableEntityException({
        section: 'invalid section given.',
      });
    }

    const { generatedMaps } = await this.permissionRepository.upsert(
      permissionDto,
      ['groupId', 'section', 'permission'],
    );

    return {
      ...permissionDto,
      ...generatedMaps[0],
    };
  }

  async createBulk(bulkPermissionDto: CreateBulkPermissionDto) {
    const group = await this.groupRepository.findOneBy({
      id: bulkPermissionDto.groupId,
    });

    if (!group) {
      throw new UnprocessableEntityException({
        groupId: 'group does not exists.',
      });
    }

    const invalidSections = bulkPermissionDto.permissions.filter(
      (permission) => !this.validateSection(permission.section),
    );

    if (invalidSections.length) {
      throw new UnprocessableEntityException({
        permissions: 'Invalid sections given',
        invalidSections,
      });
    }

    const { generatedMaps } = await this.permissionRepository.upsert(
      bulkPermissionDto.permissions.map((permission) => ({
        ...permission,
        groupId: bulkPermissionDto.groupId,
      })),
      ['groupId', 'section', 'permission'],
    );

    return bulkPermissionDto.permissions.map((permission, index) => ({
      ...permission,
      ...generatedMaps[index],
      groupId: bulkPermissionDto.groupId,
    }));
  }

  async delete(id: string) {
    await this.permissionRepository.delete(id);
  }

  async deleteBulk(removeBulkDto: RemoveBulkPermissionDto) {
    await this.permissionRepository.delete(removeBulkDto.ids);
  }

  validateSection(sectionName: string) {
    return this.adminService.sections.has(sectionName);
  }
}
