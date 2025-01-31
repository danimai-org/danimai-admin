import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'danimai-admin';

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
}
