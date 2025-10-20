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
import { PaymentModule } from './payments/payment.module';
import { PaymentTransaction } from './dal/entities/payment-transaction.entity';
import { Order } from './dal/entities/order.entity';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),

  TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'postgres',
    url: process.env.DATABASE_URL, 
    autoLoadEntities: true,
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    logging: true,
  }),
}),
  UsersModule,
  AuthModule,
  AdminModule,
  ProductsModule,
  CategoriesModule,
    CartModule,
    PaymentModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }