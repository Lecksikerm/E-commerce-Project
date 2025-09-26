import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // pass function
      ignoreExpiration: false, // reject expired tokens
      secretOrKey: process.env.JWT_SECRET || 'my-super-secret-key', // must match JwtModule secret
    });
  }

  async validate(payload: any) {
    console.log('JWT payload validated:', payload);
    return {
      userId: payload.sub, // match what AuthService sets
      email: payload.email,
      role: payload.role,
      username: payload.username,
    };
  }
}





