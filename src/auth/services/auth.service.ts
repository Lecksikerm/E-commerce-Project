import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from '../dto/auth.dto';
import { UsersService } from '../../users/users.service';
import { BcryptService } from './bcrypt.service';
import { JwtService } from '@nestjs/jwt';

export type AuthInput = { usernameOrEmail: string; password: string };
export type SigninData = { userId: number; username: string; email: string; role: string };
export type AuthResult = { accessToken: string; userId: number; username: string; email: string; role: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  /** 🔑 Authenticate a user (login flow) */
  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.signIn(user);
  }

  /** 🔍 Validate user credentials (supports username OR email) */
  async validateUser(input: AuthInput): Promise<SigninData | null> {
    // Try to find user by username OR email
    const user = this.usersService.findUserByUsernameOrEmail(input.usernameOrEmail) as unknown as {
      userId: number;
      username: string;
      email: string;
      password: string;
      role?: string;
    } | null;
    if (!user) return null;

    const isPasswordValid = await this.bcryptService.compare(input.password, user.password);
    if (!isPasswordValid) return null;

    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role || 'user', // default fallback
    };
  }

  /** 🆕 Register a new user */
  async register(signUpDto: SignUpDto) {
    const { email, name, password } = signUpDto;
    const username = email.split('@')[0];

    const userExist = this.usersService.findUserByUsernameOrEmail(email);
    if (userExist !== undefined && userExist !== null) throw new ConflictException('User already exists');

    const hashPassword = await this.bcryptService.hash(password);

    const newUser = await this.usersService.addUser({
      email,
      name,
      username,
      password: hashPassword,
      role: 'user', // ✅ explicitly set default role
    });

    return {
      message: 'User signed up successfully',
      user: {
        id: newUser.userId,
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
      },
    };
  }

  /** 🎟️ Issue JWT */
  async signIn(user: SigninData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId, // maps to req.user.userId
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      username: user.username,
      userId: user.userId,
      email: user.email,
      role: user.role,
    };
  }
}



















