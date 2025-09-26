import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
     super({
      usernameField: 'usernameOrEmail', //  Accepts username OR email
      passwordField: 'password',
    });
  }

  async validate(usernameOrEmail: string, password: string) {
    const user = await this.authService.validateUser({
      usernameOrEmail,
      password,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user; // Passport attaches this user to req.user
  }
}






