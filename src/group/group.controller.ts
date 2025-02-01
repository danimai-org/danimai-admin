import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { Auth } from 'src/decorators/auth.decorator';
import { RoleEnum } from 'src/entities';
import { groupPaginateConfig } from './group.pagination';
import { AddUsersDto } from './dto/add-users.dto';

@ApiTags('Group')
@Auth(RoleEnum.ADMIN)
@Controller('groups')
export class GroupController {
  constructor(private service: GroupService) {}

  @Get()
  @ApiPaginationQuery(groupPaginateConfig)
  getAll(@Paginate() query: PaginateQuery) {
    return this.service.getAll(query);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.service.getOne(id);
  }

  @Post()
  create(@Body() createDto: CreateGroupDto) {
    return this.service.create(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateGroupDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }

  @Post('add-users')
  addUser(@Body() addUsersDto: AddUsersDto) {
    return this.service.addUsers(addUsersDto);
  }

  @Delete('remove-users')
  removeUser(@Body() addUsersDto: AddUsersDto) {
    return this.service.removeUsers(addUsersDto);
  }
}
