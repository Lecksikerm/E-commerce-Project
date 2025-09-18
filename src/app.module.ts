import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module'; //  Import AdminModule
import { Admin } from './admin/admin.entity'; //  Import Admin entity
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'e-commerce',
      entities: [User, Admin], //  Include Admin entity if you want it registered globally
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    UsersModule,
    AdminModule, //  Register AdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


