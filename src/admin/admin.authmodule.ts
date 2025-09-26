import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../dal/entities/admin.entity';
import { AdminJwtStrategy } from '../auth/strategies/admin-jwt.strategy';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    JwtModule.register({
      secret: process.env.JWT_ADMIN_SECRET || 'my-super-admin-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => AdminModule),
  ],
  providers: [AdminJwtStrategy],
  exports: [
    JwtModule,
    PassportModule,
    TypeOrmModule,
    AdminJwtStrategy, 
  ],
})
export class AdminAuthModule {}


