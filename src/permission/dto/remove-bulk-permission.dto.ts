import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class RemoveBulkPermissionDto {
  @ApiProperty({ isArray: true })
  @IsInt({ each: true })
  ids: number[];
}
