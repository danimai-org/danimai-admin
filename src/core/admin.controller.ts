import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ADMIN_SERVICE } from './constants';
import { AdminService } from './admin.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GlobalExceptionFilter } from 'src/filters/global.filter';
import { PermissionAuth } from 'src/decorators/auth.decorator';

@Controller('admin')
@ApiTags('Admin Site')
@PermissionAuth()
@UseFilters(GlobalExceptionFilter)
export class AdminController {
  constructor(
    @Inject(forwardRef(() => ADMIN_SERVICE))
    private adminService: AdminService,
  ) {}

  @Get(':section/:entity')
  getAll(
    @Param('section') section: string,
    @Param('entity') entity: string,
    @Paginate() query: PaginateQuery,
  ) {
    return this.adminService.getAll(section, entity, query);
  }

  @Get(':section/:entity/:id')
  getOne(
    @Param('section') section: string,
    @Param('entity') entity: string,
    @Param('id') id: string,
  ) {
    return this.adminService.getOne(section, entity, id);
  }

  @Post(':section/:entity')
  @ApiBody({})
  create(
    @Param('section') section: string,
    @Param('entity') entity: string,
    @Body() createDto: any,
  ) {
    return this.adminService.create(section, entity, createDto);
  }

  @Patch(':section/:entity/:id')
  @ApiBody({})
  update(
    @Param('section') section: string,
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Body() updateDto: any,
  ) {
    return this.adminService.update(section, entity, id, updateDto);
  }

  @Delete(':section/:entity/:id')
  delete(
    @Param('section') section: string,
    @Param('entity') entity: string,
    @Param('id') id: string,
  ) {
    return this.adminService.delete(section, entity, id);
  }
}
