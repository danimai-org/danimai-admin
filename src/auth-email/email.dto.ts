import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

const strongPasswordConfig = {
  minLength: 8,
  minLowercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  minUppercase: 1,
};

export class RegisterDto {
  @ApiProperty({ example: 'example@danimai.com' })
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @IsStrongPassword(strongPasswordConfig)
  password: string;

  @ApiProperty({ example: 'Danimai Mandal' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class EmailVerifyDto {
  @ApiProperty({ example: 'vhsbdjsdfsd-dfmsdfjsd-sdfnsdk' })
  @IsString()
  verifyToken: string;
}

export class LoginDto {
  @ApiProperty({ example: 'example@danimai.com' })
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @IsStrongPassword(strongPasswordConfig)
  password: string;
}

export class SendVerifyMailDto {
  @ApiProperty({ example: 'example@danimai.com' })
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @IsStrongPassword(strongPasswordConfig)
  password: string;

  @ApiProperty({ example: 'vhsbdjsdfsd-dfmsdfjsd-sdfnsdk' })
  @IsString()
  resetToken: string;
}
