import { Inject, Module } from '@nestjs/common';
import { ADMIN_SERVICE, AdminService } from 'danimai-admin';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';

@Module({})
export class PostModule {
  constructor(
    @Inject(ADMIN_SERVICE)
    adminService: AdminService,
  ) {
    adminService.registerSection('post', {
      entity: User,
    });
  }
}
