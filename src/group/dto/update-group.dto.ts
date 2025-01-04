import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsOptional()
  description: string;
}
