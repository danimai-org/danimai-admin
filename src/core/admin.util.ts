import { EmailController } from 'src/auth-email/email.controller';
import { EmailService } from 'src/auth-email/email.service';
import { GoogleController } from 'src/auth-google/google.controller';
import { GoogleService } from 'src/auth-google/google.service';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { RefreshJwtStrategy } from 'src/auth/strategies/refresh.strategy';
import { SessionService } from 'src/session/session.service';
import { TokenService } from 'src/token/token.service';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

export const getStaticProviders = () => {
  return [
    AuthService,
    EmailService,
    GoogleService,
    SessionService,
    TokenService,
    UserService,
    JwtStrategy,
    RefreshJwtStrategy,
  ];
};

export const getStaticControllers = () => {
  return [AuthController, EmailController, GoogleController, UserController];
};
