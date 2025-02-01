import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity, PermissionAbstract } from 'danimai-admin';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from './group.entity';

export enum PermissionEnum {
  LIST_READ = 'LIST_READ',
  SINGLE_READ = 'SINGLE_READ',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity({
  name: 'permissions',
})
@Index(['section', 'permission', 'groupId'], { unique: true })
export class Permission extends BaseEntity implements PermissionAbstract {
  @ApiProperty()
  @Column()
  section: string;

  @ApiProperty()
  @Column({ enum: PermissionEnum, type: 'enum' })
  permission: PermissionEnum;

  @ApiProperty()
  @Column()
  groupId: number;

  @ApiProperty()
  @ManyToOne(() => Group, (group) => group.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  group: Group;
}
