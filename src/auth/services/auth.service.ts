import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, SignUpDto } from '../dto/auth.dto';
import { UsersService } from '../../users/users.service';
import { BcryptService } from './bcrypt.service';
import { JwtService } from '@nestjs/jwt';

export type AuthInput = { usernameOrEmail: string; password: string };
export type SigninData = {
  userId: string; 
  username: string;
  email: string;
  role: string;
};
export type AuthResult = {
  accessToken: string;
  userId: string;
  username: string;
  email: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  
  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.signIn(user);
  }

  
  async validateUser(input: AuthInput): Promise<SigninData | null> {
    const user = await this.usersService.findUserByUsernameOrEmail(
      input.usernameOrEmail,
    );
    if (!user) return null;

    const isPasswordValid = await this.bcryptService.compare(
      input.password,
      user.password,
    );
    if (!isPasswordValid) return null;

    return {
      userId: user.id, 
      username: user.username,
      email: user.email,
      role: user.role || 'user',
    };
  }

 
  async register(signUpDto: SignUpDto) {
    const { email, name, password } = signUpDto;
    const username = email.split('@')[0];

    const userExist = await this.usersService.findUserByUsernameOrEmail(email);
    if (userExist) throw new ConflictException('User already exists');

    const hashedPassword = await this.bcryptService.hash(password);

    const newUser = await this.usersService.addUser({
      email,
      name,
      username,
      password: hashedPassword,
      role: 'user',
    });

    return {
      message: 'User signed up successfully',
      user: {
        userId: newUser.id, 
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
      },
    };
  }

  
  async signIn(user: SigninData): Promise<AuthResult> {
    const payload = {
      sub: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}


























