import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //  Ensures expired tokens are rejected
      secretOrKey: process.env.JWT_SECRET || 'my-super-secret-key', // MUST match JwtModule secret
    });
  }

  async validate(payload: any) {
    console.log('✅ JWT payload validated:', payload); 
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}



