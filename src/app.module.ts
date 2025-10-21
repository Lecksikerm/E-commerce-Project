import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payments/payment.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),

  TypeOrmModule.forRootAsync({
    useFactory: () => {
      const isProduction = process.env.NODE_ENV === 'production';
      const dbUrl = process.env.DATABASE_URL;

      if (!dbUrl) {
        throw new Error('DATABASE_URL is not set');
      }

      return {
        type: 'postgres',
        url: dbUrl,
        autoLoadEntities: true,
        synchronize: false,
        migrations: ['dist/migrations/*.js'],
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        logging: true,
      };
    },
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
export class AppModule {}
