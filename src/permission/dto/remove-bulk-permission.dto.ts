import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemoveBulkPermissionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4', { each: true })
  ids: string[];
}
