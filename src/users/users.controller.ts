import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users') 
@ApiBearerAuth('user-token')   //  Tells Swagger this endpoint uses Bearer auth
@Controller('users')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@Req() req: any) {
    return req.user;
  }
}


