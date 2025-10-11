import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PaymentTransaction, User } from 'src/dal/entities/payment-transaction.entity';
import { Cart } from 'src/dal/entities/cart.entity';
import { Order } from 'src/dal/entities/order.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Order, User, Cart, PaymentTransaction])],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule { }
