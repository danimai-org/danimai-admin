import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RegisterDto } from '../auth-email/email.dto';
import { UserUpdateDto } from './user-update.dto';
import { ADMIN_DATASOURCE, APP_ENTITIES, AppEntities } from 'src/core';
import { UserAbstract } from 'src/abstracts';

@Injectable()
export class UserService {
  private userRepository: Repository<UserAbstract>;

  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
    @Inject(forwardRef(() => APP_ENTITIES))
    { user }: AppEntities,
  ) {
    this.userRepository = dataSource.getRepository(user);
  }

  async create(
    userCreateDto:
      | RegisterDto
      | Pick<UserAbstract, 'emailVerifiedAt' | 'isActive'>,
  ) {
    return this.userRepository.save(this.userRepository.create(userCreateDto));
  }

  async update(user: UserAbstract, updateDto: UserUpdateDto) {
    await this.userRepository.update(user.id, updateDto);

    return this.userRepository.create({
      ...user,
      ...updateDto,
    });
  }
}
