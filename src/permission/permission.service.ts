import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ADMIN_DATASOURCE,
  ADMIN_SERVICE,
  AdminService,
  APP_ENTITIES,
  AppEntities,
} from 'src/core';
import { Permission } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateBulkPermissionDto } from './dto/create-bulk-permission.dto';
import { RemoveBulkPermissionDto } from './dto/remove-bulk-permission.dto';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class PermissionService {
  private permissionRepository: Repository<Permission>;

  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
    @Inject(forwardRef(() => ADMIN_SERVICE))
    private adminService: AdminService,
    private groupService: GroupService,
    @Inject(forwardRef(() => APP_ENTITIES))
    { permission }: AppEntities,
  ) {
    this.permissionRepository = dataSource.getRepository(permission);
  }

  async getByGroup(groupId: number) {
    return this.permissionRepository.find({
      where: {
        groupId,
      },
    });
  }

  async create(permissionDto: CreatePermissionDto) {
    try {
      await this.groupService.getOne(permissionDto.groupId);
    } catch {
      throw new UnprocessableEntityException({
        groupId: 'Group does not exists.',
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
    try {
      await this.groupService.getOne(bulkPermissionDto.groupId);
    } catch {
      throw new UnprocessableEntityException({
        groupId: 'Group does not exists.',
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
