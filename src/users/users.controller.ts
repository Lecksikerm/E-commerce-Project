import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service'; 

@ApiTags('Users')
@ApiBearerAuth('user-token')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@Req() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Get('/all')
  async getAllUsers() {
    return this.usersService.findAll();
  }
}





