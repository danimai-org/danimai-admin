import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GlobalExceptionFilter } from 'src/filters/global.filter';
import { PermissionAuth } from 'src/decorators/auth.decorator';
import { ParseSectionPipe } from 'src/pipes/section.pipe';
import type { AdminSection } from './admin.interface';

@ApiParam({
  name: 'section',
  type: 'string',
})
@Controller('admin')
@ApiTags('Admin Site')
@PermissionAuth()
@UseFilters(GlobalExceptionFilter)
export class AdminController {
  @ApiOperation({
    summary: 'Get many instances of section entity with pagination',
  })
  @Get(':section')
  getAll(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Paginate() query: PaginateQuery,
  ) {
    return section.service.getMany(section, query);
  }

  @ApiOperation({
    summary: 'Get relation instances of section entity',
  })
  @Get(':section/relation/:relationProperty')
  getAllRelation(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Param('relationProperty') relationProperty: string,
    @Paginate() query: PaginateQuery,
  ) {
    return section.service.getAllRelation(section, relationProperty, query);
  }

  @ApiOperation({
    summary: 'Get single instance of section entity by id',
  })
  @Get(':section/:id')
  getOne(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Param('id') id: number,
  ) {
    return section.service.getOne(section, id);
  }

  @ApiOperation({
    summary: 'Create a instance of section entity',
  })
  @Post(':section')
  @ApiBody({})
  create(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Body() createDto: any,
  ) {
    return section.service.createOne(section, createDto);
  }

  @ApiOperation({
    summary: 'update a instance of section entity',
  })
  @Patch(':section/:id')
  @ApiBody({})
  update(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Param('id') id: number,
    @Body() updateDto: any,
  ) {
    return section.service.updateOne(section, id, updateDto);
  }

  @ApiOperation({
    summary: 'delete a instance of section entity by id',
  })
  @Delete(':section/:id')
  delete(
    @Param('section', ParseSectionPipe) section: AdminSection<any>,
    @Param('id') id: number,
  ) {
    return section.service.deleteOne(section, id);
  }
}
