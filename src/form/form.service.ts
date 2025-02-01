import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ADMIN_DATASOURCE, ADMIN_SERVICE, AdminService } from 'src/core';
import { DataSource } from 'typeorm';
import { zodToJsonSchema } from 'zod-to-json-schema';

@Injectable()
export class FormService {
  constructor(
    @Inject(forwardRef(() => ADMIN_SERVICE))
    private adminService: AdminService,
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    private dataSource: DataSource,
  ) {}

  getUpdateForm(sectionName: string) {
    const section = this.adminService.getSection(sectionName);
    return zodToJsonSchema(section.updateValidationSchema);
  }
}
