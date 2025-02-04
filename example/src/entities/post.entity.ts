import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'danimai-admin';
import { User } from './user.entity';

@Entity({ name: 'posts' })
export class Post extends BaseEntity {
  @ApiProperty({ example: 'Here is my title.' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ example: 'My content' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.posts)
  @JoinTable()
  users: User[];
}
