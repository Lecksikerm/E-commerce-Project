import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './dal/entities/user.entity';
import { Admin } from './dal/entities/admin.entity'; 
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ProductsModule } from './products/products.module';
import { Product } from './dal/entities/product.entity';
import { Category } from './dal/entities/category.entity';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    //  Configure TypeORM
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.DB_NAME || 'e-commerce',
        entities: [User, Admin, Product, Category],
        synchronize: true, 
        logging: true,
      }),
    }),

    UsersModule,
    AuthModule,
    AdminModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }




