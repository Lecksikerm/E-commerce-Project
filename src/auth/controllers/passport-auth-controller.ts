import { Controller, Post, HttpCode, HttpStatus, UseGuards, Req, Get, NotImplementedException, RequestMethod } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { PassportLocalGuard } from '../guards/passport-local-guard';
import { PassportJwtAuthGuard } from '../guards/passport-jwt.guard';

@Controller('v2/auth')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(PassportLocalGuard)
  @Post('/login')
  login(@Req() req: any) {
    return this.authService.signIn(req.user);
  }

  
  @Get('/me')
  @UseGuards(PassportJwtAuthGuard)
  getUserInfo(@Req() req: any) {
    console.log('Authenticated user:', req.user);
    return req.user;
  }
}




