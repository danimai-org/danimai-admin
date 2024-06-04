import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from '../auth-email/email.dto';
import { UserUpdateDto } from './user-update.dto';
import { ADMIN_DATASOURCE } from 'src/core';

@Injectable()
export class UserService {
  userRepository: Repository<User>;
  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
  ) {
    this.userRepository = dataSource.getRepository(User);
  }

  async create(
    userCreateDto:
      | RegisterDto
      | Pick<User, 'emailVerifiedAt' | 'isActive' | 'provider'>,
  ) {
    const user = User.create({ ...userCreateDto });
    return this.userRepository.save(user);
  }

  async update(user: User, updateDto: UserUpdateDto) {
    await this.userRepository.update(user.id, updateDto);

    return {
      ...user,
      ...updateDto,
    };
  }
}
