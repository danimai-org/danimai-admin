import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserParam } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { UserUpdateDto } from './user-update.dto';

@ApiTags('User (Danimai Admin)')
@ApiBearerAuth()
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @ApiOperation({ summary: 'get logged in user details' })
  async me(@UserParam() user: User) {
    return user;
  }

  @Patch('/me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update logged in user',
  })
  @ApiOperation({
    summary: 'update logged in user',
  })
  async update(@UserParam() user: User, @Body() updateDto: UserUpdateDto) {
    return this.userService.update(user, updateDto);
  }
}
