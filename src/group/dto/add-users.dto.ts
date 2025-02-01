import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddUsersDto {
  @ApiProperty({ isArray: true })
  @IsInt({ each: true })
  userIds: number[];

  @ApiProperty({})
  @IsInt()
  id: number;
}
