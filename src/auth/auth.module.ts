import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptService } from './services/bcrypt.service';
import { AuthGuard } from './guards/auth.guard';
import { PassportAuthController } from './controllers/passport-auth-controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, PassportAuthController],
  providers: [AuthService, BcryptService, LocalStrategy, AuthGuard],
  exports: [JwtModule, AuthService, AuthGuard], // ✅ Export AuthGuard so UsersModule can use it
})
export class AuthModule {}


















