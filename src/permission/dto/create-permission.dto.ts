import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { PermissionEnum } from 'src/entities';

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  section: string;

  @ApiProperty({ enum: PermissionEnum })
  @IsEnum(PermissionEnum)
  permission: PermissionEnum;

  @ApiProperty()
  @IsInt()
  groupId: number;
}
