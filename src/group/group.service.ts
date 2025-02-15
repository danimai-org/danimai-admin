import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ADMIN_DATASOURCE, APP_ENTITIES, AppEntities } from 'src/core';
import { Group, RoleEnum } from 'src/entities';
import { DataSource, In, Not, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { groupPaginateConfig } from './group.pagination';
import { plainToInstance } from 'class-transformer';
import { AddUsersDto } from './dto/add-users.dto';
import { GroupAbstract, UserAbstract } from 'src/abstracts';

@Injectable()
export class GroupService {
  private groupRepository: Repository<GroupAbstract>;
  private userRepository: Repository<UserAbstract>;

  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
    @Inject(forwardRef(() => APP_ENTITIES))
    { group, user }: AppEntities,
  ) {
    this.groupRepository = dataSource.getRepository(group);
    this.userRepository = dataSource.getRepository(user);
  }

  async getAll(query: PaginateQuery) {
    return paginate(
      query,
      this.groupRepository.createQueryBuilder(),
      groupPaginateConfig,
    );
  }

  async getOne(id: number) {
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

  async update(id: number, updateDto: UpdateGroupDto) {
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

  async delete(id: number) {
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
