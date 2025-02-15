import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TokenType } from 'src/entities/token.entity';
import { DataSource, Repository } from 'typeorm';
import { ADMIN_DATASOURCE, APP_ENTITIES, AppEntities } from 'src/core';
import { TokenAbstract, UserAbstract } from 'src/abstracts';

@Injectable()
export class TokenService {
  private tokenRepository: Repository<TokenAbstract>;

  constructor(
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
    @Inject(forwardRef(() => APP_ENTITIES))
    { token }: AppEntities,
  ) {
    this.tokenRepository = dataSource.getRepository(token);
  }

  async create(
    user: UserAbstract,
    type: keyof typeof TokenType = 'REGISTER_VERIFY',
    expiresAt: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  ) {
    const token = this.tokenRepository.create({
      user: { id: user.id },
      type: TokenType[type],
      expiresAt,
    });

    return this.tokenRepository.save(token);
  }

  async verify(token: string, type: keyof typeof TokenType) {
    const tokenEntity = await this.tokenRepository.findOne({
      relations: ['user'],
      loadEagerRelations: true,
      where: { token, type: TokenType[type], isUsed: false },
    });
    if (!tokenEntity) {
      throw new Error('Token not found');
    }
    if (tokenEntity.expiresAt < new Date()) {
      throw new Error('Token expired');
    }
    tokenEntity.isUsed = true;
    await tokenEntity.save();
    return tokenEntity.user;
  }
}
