import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ROLES_KEY } from './role.decorator';
import { RoleEnum } from 'src/entities';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards';

export function Auth(...roles: RoleEnum[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthGuard('jwt'), new RolesGuard(roles)),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
