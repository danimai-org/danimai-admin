import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { PermissionEnum } from 'src/entities';

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  section: string;

  @ApiProperty({ enum: PermissionEnum })
  @IsEnum(PermissionEnum)
  permission: PermissionEnum;

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  groupId: string;
}
