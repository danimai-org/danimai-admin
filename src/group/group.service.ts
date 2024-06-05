import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ADMIN_DATASOURCE } from 'src/core';
import { Group } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { groupPaginateConfig } from './group.pagination';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GroupService {
  groupRepository: Repository<Group>;
  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
  ) {
    this.groupRepository = dataSource.getRepository(Group);
  }

  async getAll(query: PaginateQuery) {
    return paginate(
      query,
      this.groupRepository.createQueryBuilder(),
      groupPaginateConfig,
    );
  }

  async getOne(id: string) {
    const group = await this.groupRepository.findOneBy({
      id,
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async create(createDto: CreateGroupDto) {
    return this.groupRepository.save(createDto);
  }

  async update(id: string, updateDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOneBy({
      id,
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    await this.groupRepository.update({ id }, updateDto);
    return plainToInstance(Group, {
      ...group,
      ...updateDto,
    });
  }

  async delete(id: string) {
    const group = await this.groupRepository.findOneBy({
      id,
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    await this.groupRepository.delete(id);
  }
}
