import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { GroupAbstract } from 'src/abstracts';

@Entity({
  name: 'groups',
})
export class Group extends BaseEntity implements GroupAbstract {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @OneToMany(() => User, (user) => user.group)
  users: User[];

  @ApiProperty()
  @OneToMany(() => Permission, (permission) => permission.group)
  permissions: Permission[];
}
