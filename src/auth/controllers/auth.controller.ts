import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SignUpDto } from '../dto/auth.dto';
import { AuthService, AuthInput } from '../services/auth.service';
import { AuthGuard } from '../guards/auth-guard';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport'; //  Built-in passport guard

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Existing signup route
  @Post('/signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  // Temporary route to quickly create a new user "Alice"
  @Post('/create-alice')
  async createAlice() {
    return this.authService.register({
      email: 'alice@gmail.com',
      name: 'Alice',
      password: 'password123',
    });
  }

  // Login route using Passport Local strategy
  @UseGuards(PassportAuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Req() req: Request) {
    return this.authService.signIn(req.user as any);
  }

  // Get current user route
  @UseGuards(AuthGuard)
  @Get('/me')
  getUserInfo(@Req() request: Request) {
    return request.user;
  }
}







