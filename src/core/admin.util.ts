import { EmailController } from 'src/auth-email/email.controller';
import { EmailService } from 'src/auth-email/email.service';
import { GoogleController } from 'src/auth-google/google.controller';
import { GoogleService } from 'src/auth-google/google.service';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { SessionService } from 'src/session/session.service';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

export const getStaticProviders = () => {
  return [
    AuthService,
    EmailService,
    GoogleService,
    SessionService,
    TokenService,
    UserService,
  ];
};

export const getStaticControllers = () => {
  return [AuthController, EmailController, GoogleController];
};
