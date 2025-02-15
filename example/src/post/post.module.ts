import { Inject, Module } from '@nestjs/common';
import { ADMIN_SERVICE, AdminService } from 'danimai-admin';
import { Post } from 'src/entities/post.entity';
import { PostService } from './post.service';

@Module({})
export class PostModule {
  constructor(
    @Inject(ADMIN_SERVICE)
    adminService: AdminService,
  ) {
    adminService.registerSection('post', {
      entity: Post,
      service: PostService,
    });
  }
}
