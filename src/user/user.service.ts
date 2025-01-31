import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from '../auth-email/email.dto';
import { UserUpdateDto } from './user-update.dto';
import { ADMIN_DATASOURCE, APP_ENTITIES, AppEntities } from 'src/core';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  private userRepository: Repository<User>;

  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
    @Inject(forwardRef(() => APP_ENTITIES))
    { user }: AppEntities,
  ) {
    this.userRepository = dataSource.getRepository(user);
  }

  async create(
    userCreateDto: RegisterDto | Pick<User, 'emailVerifiedAt' | 'isActive'>,
  ) {
    const user = User.create({ ...userCreateDto });
    return this.userRepository.save(user);
  }

  async update(user: User, updateDto: UserUpdateDto) {
    await this.userRepository.update(user.id, updateDto);

    return plainToInstance(User, {
      ...user,
      ...updateDto,
    });
  }
}
