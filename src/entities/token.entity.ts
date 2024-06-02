import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base';

export enum TokenType {
  REGISTER_VERIFY = 'REGISTER_VERIFY',
  CREATE_PASSWORD = 'CREATE_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  token: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({ name: 'userId' })
  user: User;

  @BeforeInsert()
  async generateToken() {
    this.token = `${randomStringGenerator()}-${randomStringGenerator()}`;
  }
}
