import { Controller, Post, HttpCode, HttpStatus, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('/auth-v2')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local')) // passport-local
  @Post('/login')
  async login(@Req() req: any) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getUserInfo(@Req() req: any) {
    return req.user;
  }
}




