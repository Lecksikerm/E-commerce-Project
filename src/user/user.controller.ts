import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from './../auth/guards/auth.guard';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('/me')
  getUserInfo(@Req() req: any) {
    return req.user;
  }
}



