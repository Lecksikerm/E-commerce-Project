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

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Existing signup route
  @Post('/signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  // Login route using Passport Local strategy
  @UseGuards(PassportAuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Req() req: Request) {
    return this.authService.signIn(req.user as any);
  }
}







