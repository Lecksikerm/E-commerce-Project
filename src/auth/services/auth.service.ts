import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from '../dto/auth.dto';
import { UsersService } from '../../users/users.service';
import { BcryptService } from './bcrypt.service';
import { JwtService } from '@nestjs/jwt';

export type AuthInput = { username: string; password: string };
export type SigninData = { userId: number; username: string };
export type AuthResult = { accessToken: string; userId: number; username: string };

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

  /** 🔍 Validate user credentials */
  async validateUser(input: AuthInput): Promise<SigninData | null> {
    const user = await this.usersService.findUserByName(input.username);
    if (!user) return null;

    const isPasswordValid = await this.bcryptService.compare(
      input.password,
      user.password,
    );
    if (!isPasswordValid) return null;

    return { userId: user.userId, username: user.username };
  }

  /** 📝 Register a new user (in-memory) */
  async register(signUpDto: SignUpDto) {
    const { email, name, password } = signUpDto;

    const userExist = await this.usersService.findUserByName(email.split('@')[0]);
    if (userExist) throw new ConflictException('User already exists');

    const hashPassword = await this.bcryptService.hash(password);

    const newUser = await this.usersService.addUser({
      email,
      name,
      username: email.split('@')[0],
      password: hashPassword,
    });

    return {
      message: 'User signed up successfully',
      user: {
        id: newUser.userId,
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
      },
    };
  }

  /** 🎟️ Generate JWT token */
  async signIn(user: SigninData): Promise<AuthResult> {
    const tokenPayload = { sub: user.userId, username: user.username };
    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      username: user.username,
      userId: user.userId,
    };
  }
}














