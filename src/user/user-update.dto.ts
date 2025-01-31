import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({ example: 'Danimai', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
