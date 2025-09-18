import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'my-super-secret-key',
    });
  }

  async validate(payload: any) {
    // Whatever you return becomes `req.user`

    
    return {
      userId: payload.sub,
      
      email: payload.email,
      role: payload.role,
    };
  }
}

