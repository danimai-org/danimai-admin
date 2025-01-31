import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Session } from 'src/entities/session.entity';
import { User } from 'src/entities/user.entity';
import { ADMIN_DATASOURCE, APP_ENTITIES, AppEntities } from 'src/core';

@Injectable()
export class SessionService {
  private sessionRepository: Repository<Session>;

  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
    @Inject(forwardRef(() => APP_ENTITIES))
    { session }: AppEntities,
  ) {
    this.sessionRepository = dataSource.getRepository(session);
  }

  create(user: User) {
    return this.sessionRepository
      .create({
        user,
      })
      .save();
  }

  async get(id: string) {
    const session = await this.sessionRepository.findOneBy({
      id,
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async delete(id: string) {
    await this.sessionRepository.softDelete({
      id,
    });
  }
}
