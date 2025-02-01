import { PipeTransform, Injectable, Inject, forwardRef } from '@nestjs/common';
import { ADMIN_SERVICE, AdminService } from 'src/core';

@Injectable()
export class ParseSectionPipe implements PipeTransform {
  constructor(
    @Inject(forwardRef(() => ADMIN_SERVICE))
    private adminService: AdminService,
  ) {}

  transform(section: string) {
    return this.adminService.getSection(section);
  }
}
