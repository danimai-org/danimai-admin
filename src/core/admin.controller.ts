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
import { ParseSectionPipe } from 'src/pipes/section.pipe';
import { AdminSection } from './admin.interface';

@Controller('admin')
@ApiTags('Admin Site')
@PermissionAuth()
@UseFilters(GlobalExceptionFilter)
export class AdminController {
  constructor(
    @Inject(forwardRef(() => ADMIN_SERVICE))
    private adminService: AdminService,
  ) {}

  @Get(':section')
  getAll(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Paginate() query: PaginateQuery,
  ) {
    return section.service.getMany(section, query);
  }

  @Get(':section/relation/:relationProperty')
  getAllRelation(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Param('relationProperty') relationProperty: string,
    @Paginate() query: PaginateQuery,
  ) {
    return section.service.getAllRelation(section, relationProperty, query);
  }

  @Get(':section/:id')
  getOne(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Param('id') id: number,
  ) {
    return section.service.getOne(section, id);
  }

  @Post(':section')
  @ApiBody({})
  create(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Body() createDto: any,
  ) {
    return section.service.createOne(section, createDto);
  }

  @Patch(':section/:id')
  @ApiBody({})
  update(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Param('id') id: number,
    @Body() updateDto: any,
  ) {
    return section.service.updateOne(section, id, updateDto);
  }

  @Delete(':section/:id')
  delete(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Param('id') id: number,
  ) {
    return section.service.deleteOne(section, id);
  }
}
