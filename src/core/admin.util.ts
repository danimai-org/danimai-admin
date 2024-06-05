import { EmailController } from 'src/auth-email/email.controller';
import { EmailService } from 'src/auth-email/email.service';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { RefreshJwtStrategy } from 'src/auth/strategies/refresh.strategy';
import { GroupController } from 'src/group/group.controller';
import { GroupService } from 'src/group/group.service';
import { PermissionController } from 'src/permission/permission.controller';
import { PermissionService } from 'src/permission/permission.service';
import { SessionService } from 'src/session/session.service';
import { TokenService } from 'src/token/token.service';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

export const getStaticProviders = () => {
  return [
    AuthService,
    EmailService,
    SessionService,
    TokenService,
    UserService,
    JwtStrategy,
    RefreshJwtStrategy,
    GroupService,
    PermissionService,
  ];
};

export const getStaticControllers = () => {
  return [
    AuthController,
    EmailController,
    UserController,
    GroupController,
    PermissionController,
  ];
};
