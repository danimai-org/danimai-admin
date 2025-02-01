import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  UseFilters,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionService } from './permission.service';
import { CreateBulkPermissionDto } from './dto/create-bulk-permission.dto';
import { RemoveBulkPermissionDto } from './dto/remove-bulk-permission.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { RoleEnum } from 'src/entities';
import { ApiTags } from '@nestjs/swagger';
import { GlobalExceptionFilter } from 'src/filters/global.filter';

@ApiTags('Permission')
@Auth(RoleEnum.ADMIN)
@Controller('permissions')
@UseFilters(GlobalExceptionFilter)
export class PermissionController {
  constructor(private service: PermissionService) {}

  @Get('group/:groupId')
  getByGroupId(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.service.getByGroup(groupId);
  }

  @Post()
  create(@Body() createDto: CreatePermissionDto) {
    return this.service.create(createDto);
  }

  @Post('bulk')
  createBulk(@Body() createBulkDto: CreateBulkPermissionDto) {
    return this.service.createBulk(createBulkDto);
  }

  @Delete('bulk')
  deleteBulk(@Body() removeBulkDto: RemoveBulkPermissionDto) {
    return this.service.deleteBulk(removeBulkDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete(id);
  }
}
