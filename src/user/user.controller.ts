import { Body, Controller, Get, HttpStatus, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserParam } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { UserUpdateDto } from './user-update.dto';
import { Auth } from 'src/decorators/auth.decorator';

@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
@Auth()
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
