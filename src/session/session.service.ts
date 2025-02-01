import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ADMIN_DATASOURCE, APP_ENTITIES, AppEntities } from 'src/core';
import { SessionAbstract, UserAbstract } from 'src/abstracts';

@Injectable()
export class SessionService {
  private sessionRepository: Repository<SessionAbstract>;

  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
    @Inject(forwardRef(() => APP_ENTITIES))
    { session }: AppEntities,
  ) {
    this.sessionRepository = dataSource.getRepository(session);
  }

  create(user: UserAbstract) {
    return this.sessionRepository
      .create({
        user,
      })
      .save();
  }

  async get(id: number) {
    const session = await this.sessionRepository.findOneBy({
      id,
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async delete(id: number) {
    await this.sessionRepository.softDelete(id);
  }
}
