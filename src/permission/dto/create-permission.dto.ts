import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { PermissionEnum } from 'src/entities';

export class CreatePermissionDto {
  @ApiProperty()
  @Type(() => PermissionDto)
  @ValidateNested()
  data: PermissionDto[];
}

class PermissionDto {
  @ApiProperty()
  @IsString()
  section: string;

  @ApiProperty()
  @IsEnum(PermissionEnum, { each: true })
  permissions: PermissionEnum[];
}
