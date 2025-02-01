import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { MailData } from 'src/mail/mail.interface';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => MailerService))
    private mailerService: MailerService,
    private sessionService: SessionService,
  ) {}

  async createJwtToken(user: User) {
    const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;
    const session = await this.sessionService.create(user);

    const accessToken = await this.createAccessToken(session.id);
    const refreshToken = this.jwtService.sign(
      {
        id: session.id,
        type: 'REFRESH',
      },
      {
        expiresIn: refreshTokenExpiresIn,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async createAccessToken(sessionId: number) {
    const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;

    const payload = {
      id: sessionId,
      type: 'ACCESS',
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiresIn,
    });

    return accessToken;
  }

  async userRegisterEmail(
    mailData: MailData<{
      hash: string;
    }>,
  ) {
    const frontendDomain = process.env.FRONTEND_DOMAIN;
    const appName = process.env.APP_NAME;

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Thank You For Registration, Verify Your Account.',
      text: `${frontendDomain}/auth/verify?token=${mailData.data.hash}`,
      template: 'registration',
      context: {
        url: `${frontendDomain}/auth/verify?token=${mailData.data.hash}`,
        appName,
        title: 'Thank You For Registration, Verify Your Account.',
        actionTitle: 'Verify Your Account',
      },
    });
  }

  async forgotPasswordEmail(
    mailData: MailData<{
      hash: string;
    }>,
  ) {
    const frontendDomain = process.env.FRONTEND_DOMAIN;
    const appName = process.env.APP_NAME;

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Here is your Link for Reset Password.',
      text: `${frontendDomain}/auth/reset-password?token=${mailData.data.hash}`,
      template: 'registration',
      context: {
        url: `${frontendDomain}/auth/reset-password?token=${mailData.data.hash}`,
        appName,
        title: 'Here is your Link for Reset Password.',
        actionTitle: 'Reset Password',
      },
    });
  }
}
