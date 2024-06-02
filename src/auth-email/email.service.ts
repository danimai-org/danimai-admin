import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  EmailVerifyDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SendVerifyMailDto,
} from './email.dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { AuthProvider, User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { ADMIN_DATASOURCE } from 'src/core';

@Injectable()
export class EmailService {
  userRepository: Repository<User>;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenService: TokenService,
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
  ) {
    this.userRepository = dataSource.getRepository(User);
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    const token = await this.tokenService.create(user, 'REGISTER_VERIFY');
    await this.authService.userRegisterEmail({
      to: user.email,
      data: {
        hash: token.token,
      },
    });
  }

  async verify(verifyDto: EmailVerifyDto) {
    try {
      const user = await this.tokenService.verify(
        verifyDto.verifyToken,
        'REGISTER_VERIFY',
      );
      user.emailVerifiedAt = new Date();
      user.isActive = true;
      await user.save();
    } catch (e) {
      throw new UnprocessableEntityException({ verify_token: e.message });
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnprocessableEntityException({ email: 'User not found' });
    }

    if (user.provider !== AuthProvider.EMAIL) {
      throw new UnprocessableEntityException({
        email: `User is registered with ${user.provider}`,
      });
    }
    if (!user.isActive) {
      throw new UnprocessableEntityException({ email: 'User not active' });
    }
    if (!user.emailVerifiedAt) {
      throw new UnprocessableEntityException({
        email: 'User not verified',
      });
    }
    if (!user.comparePassword(loginDto.password)) {
      throw new UnprocessableEntityException({
        password: 'Password is incorrect',
      });
    }
    return this.authService.createJwtToken(user);
  }

  async sendVerifyMail(sendVerifyMailDto: SendVerifyMailDto) {
    const user = await this.userRepository.findOne({
      where: { email: sendVerifyMailDto.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException({ email: 'User not found' });
    }
    if (user.emailVerifiedAt) {
      throw new UnprocessableEntityException({
        email: 'User already verified',
      });
    }
    const token = await this.tokenService.create(user, 'REGISTER_VERIFY');
    await this.authService.userRegisterEmail({
      to: user.email,
      data: {
        hash: token.token,
      },
    });
  }

  async sendForgotMail(sendForgotMailDto: SendVerifyMailDto) {
    const user = await this.userRepository.findOne({
      where: { email: sendForgotMailDto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnprocessableEntityException({ email: 'User not found' });
    }

    if (!user.emailVerifiedAt) {
      throw new UnprocessableEntityException({
        email: 'Please verify email first.',
      });
    }

    const token = await this.tokenService.create(user, 'RESET_PASSWORD');
    await this.authService.forgotPasswordEmail({
      to: user.email,
      data: {
        hash: token.token,
      },
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const user = await this.tokenService.verify(
        resetPasswordDto.resetToken,
        'RESET_PASSWORD',
      );
      user.password = resetPasswordDto.password;
      await user.save();
    } catch (e) {
      throw new UnprocessableEntityException({ reset_token: e.message });
    }
  }
}
