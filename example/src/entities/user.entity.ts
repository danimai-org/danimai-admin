import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Group } from './group.entity';
import { Token } from './token.entity';
import { Session } from './session.entity';
import { BaseEntity, UserAbstract } from 'danimai-admin';
import * as bcrypt from 'bcryptjs';

export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity({ name: 'users' })
export class User extends BaseEntity implements UserAbstract {
  @ApiProperty({ example: 'Danimai' })
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @ApiProperty({ example: 'example@danimai.com' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  groupId: number;

  @ApiProperty()
  @Column({ type: 'timestamp with time zone', nullable: true })
  emailVerifiedAt: Date;

  @ApiProperty()
  @Column({ type: 'enum', default: RoleEnum.USER, enum: RoleEnum })
  role: RoleEnum;

  @ApiHideProperty()
  previousPassword: string;

  @ApiProperty()
  @ManyToOne(() => Group, (group) => group.users)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @ApiProperty()
  @OneToMany(() => Token, (token) => token.user)
  tokens: Group;

  @ApiProperty()
  @OneToMany(() => Session, (session) => session.user)
  sessions: Group;

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
    this.email = this.email.toLowerCase();
  }

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
