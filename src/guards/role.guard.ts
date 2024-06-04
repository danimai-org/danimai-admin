import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RoleEnum } from 'src/entities';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private roles: RoleEnum[]) {}

  canActivate(context: ExecutionContext): boolean {
    if (!this.roles.length) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest().user;
    return this.roles.some((role) => user.roles?.includes(role));
  }
}
