import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddUsersDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4', { each: true })
  userIds: string[];

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  id: string;
}
