import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { SignUpDto, LoginDto } from '../dto/auth.dto';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Register a new user */
  @Post('/signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  /** Login using Passport Local Strategy */
  @UseGuards(PassportAuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOperation({ summary: 'User login (passport-local strategy)' })
  @ApiBody({
    type: LoginDto,
    examples: {
      default: {
        summary: 'Example login payload',
        value: {
          usernameOrEmail: 'ademola',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT access token',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        userId: 1,
        username: 'ademola',
        email: 'ademola@example.com',
        role: 'user',
      },
    },
  })
  async login(@Req() req: any) {
    return this.authService.signIn(req.user);
  }
}












