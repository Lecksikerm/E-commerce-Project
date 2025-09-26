import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth, 
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { PassportLocalGuard } from '../guards/passport-local-guard';
import { PassportJwtAuthGuard } from '../guards/passport-jwt.guard';
import { LoginDto } from '../dto/auth.dto';

@ApiTags('Passport Auth')
@Controller('v2/auth')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(PassportLocalGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Login using passport-local strategy' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Returns a JWT token with user details',
  })
  login(@Req() req: any) {
    return this.authService.signIn(req.user);
  }

  @Get('/me')
  @UseGuards(PassportJwtAuthGuard)
  @ApiBearerAuth('access-token') 
  @ApiOperation({ summary: 'Get logged-in user info' })
  @ApiResponse({
    status: 200,
    description: 'Returns user info from JWT',
  })
  getUserInfo(@Req() req: any) {
    console.log('Authenticated user:', req.user);
    return req.user;
  }
}






