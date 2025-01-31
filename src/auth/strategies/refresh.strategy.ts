import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SessionService } from '../../session/session.service';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private sessionService: SessionService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  public async validate(payload: JwtPayload) {
    try {
      if (payload.type !== 'REFRESH') {
        throw new UnauthorizedException('Invalid token provided.');
      }
      const session = await this.sessionService.get(payload.id);

      if (!session) {
        throw new UnauthorizedException('Invalid token provided.');
      }

      return session;
    } catch {
      throw new UnauthorizedException('User is not authorized.');
    }
  }
}
