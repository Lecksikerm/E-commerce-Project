import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PassportAuthController } from './controllers/passport-auth-controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { BcryptService } from './services/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController, PassportAuthController],
  providers: [AuthService, BcryptService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}





