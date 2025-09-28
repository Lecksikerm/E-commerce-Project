import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../dal/entities/cart.entity';
import { CartItem } from '../dal/entities/cart-item.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Product } from '../dal/entities/product.entity';
import { User } from '../dal/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, User])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
