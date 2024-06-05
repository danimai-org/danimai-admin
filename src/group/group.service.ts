import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ADMIN_DATASOURCE } from 'src/core';
import { Group, RoleEnum, User } from 'src/entities';
import { DataSource, In, Not, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { groupPaginateConfig } from './group.pagination';
import { plainToInstance } from 'class-transformer';
import { AddUsersDto } from './dto/add-users.dto';

@Injectable()
export class GroupService {
  groupRepository: Repository<Group>;
  userRepository: Repository<User>;
  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
  ) {
    this.groupRepository = dataSource.getRepository(Group);
    this.userRepository = dataSource.getRepository(User);
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

  async addUsers(addUsersDto: AddUsersDto) {
    try {
      await this.getOne(addUsersDto.id);
    } catch {
      throw new UnprocessableEntityException({
        id: 'Group does not exists.',
      });
    }
    await this.userRepository.update(
      {
        id: In(addUsersDto.userIds),
        role: Not(RoleEnum.ADMIN),
      },
      {
        groupId: addUsersDto.id,
      },
    );
  }

  async removeUsers(addUsersDto: AddUsersDto) {
    try {
      await this.getOne(addUsersDto.id);
    } catch {
      throw new UnprocessableEntityException({
        id: 'Group does not exists.',
      });
    }
    await this.userRepository.update(
      {
        id: In(addUsersDto.userIds),
      },
      {
        groupId: null,
      },
    );
  }
}
