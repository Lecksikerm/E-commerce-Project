import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return req.user;
  }
}

