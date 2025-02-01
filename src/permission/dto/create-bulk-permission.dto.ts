import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionEnum } from 'src/entities';

export class CreateBulkPermissionDto {
  @ApiProperty()
  @IsInt()
  groupId: number;

  @ApiProperty()
  @Type(() => CreatePermissionDto)
  @ValidateNested({ each: true })
  permissions: CreatePermissionDto[];
}

class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  section: string;

  @ApiProperty({ enum: PermissionEnum })
  @IsEnum(PermissionEnum)
  permission: PermissionEnum;
}
