import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptService } from './services/bcrypt.service';
import { AuthGuard } from './guards/auth.guard';
import { PassportAuthController } from './controllers/passport-auth-controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),

    
    PassportModule.register({ defaultStrategy: 'jwt' }),

    
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'my-super-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, PassportAuthController],
  providers: [
    AuthService,
    BcryptService,
    LocalStrategy,
    JwtStrategy, 
    AuthGuard,
  ],
  exports: [
    JwtModule,          
    PassportModule,     
    AuthService,
    AuthGuard,
    JwtStrategy,        
  ],
})
export class AuthModule {}




















