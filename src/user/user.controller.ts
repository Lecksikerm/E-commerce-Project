import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth-guard'; // ✅ adjust path if needed
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor() {}

  // ✅ Get current logged-in user
  @UseGuards(AuthGuard)
  @Get('/me')
  getUserInfo(@Req() request: Request) {
    return request.user;
  }
}

