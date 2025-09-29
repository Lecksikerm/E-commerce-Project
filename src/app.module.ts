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
import { CategoriesModule } from './categories/categories.module';
import { Cart } from './dal/entities/cart.entity';
import { CartItem } from './dal/entities/cart-item.entity';
import { CartModule } from './cart/cart.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentTransaction } from './dal/entities/payment-transaction.entity';

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
        entities: [User, Admin, Product, Category, Cart, CartItem, PaymentTransaction],
        synchronize: true, 
        logging: true,
      }),
    }),

    UsersModule,
    AuthModule,
    AdminModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }




