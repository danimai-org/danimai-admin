import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  UseFilters,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SessionService } from '../../session/session.service';
import { GlobalExceptionFilter } from 'src/filters/global.filter';

export type JwtPayload = {
  id: number;
  type: 'ACCESS' | 'REFRESH';
  iat: number;
  exp: number;
};
@UseFilters(GlobalExceptionFilter)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private sessionService: SessionService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  public async validate(payload: JwtPayload) {
    try {
      if (payload.type !== 'ACCESS') {
        throw new UnauthorizedException('Invalid token provided.');
      }
      const session = await this.sessionService.get(payload.id);

      if (!session) {
        throw new UnauthorizedException('Invalid token provided.');
      }

      const { user } = session;
      if (!user.emailVerifiedAt) {
        throw new UnauthorizedException('Please verify your email.');
      }

      if (!user.isActive) {
        throw new ForbiddenException('Your account is not active.');
      }
      return session;
    } catch {
      throw new UnauthorizedException('User is not authorized.');
    }
  }
}
