import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService, SigninData } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "my-local") {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'login', passwordField: 'pass' });
  }

  async validate(username: string, password: string): Promise<SigninData> {
    const user = await this.authService.validateUser({ username, password });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user; // attached to req.user
  }
}




