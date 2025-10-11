import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/dal/entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Cart } from 'src/dal/entities/cart.entity';
import { User } from 'src/dal/entities/user.entity';
import { PaymentTransaction } from 'src/dal/entities/payment-transaction.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly ordersRepo: Repository<Order>,

        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,

        @InjectRepository(Cart)
        private readonly cartsRepo: Repository<Cart>,

        @InjectRepository(PaymentTransaction)
        private readonly paymentsRepo: Repository<PaymentTransaction>,
    ) { }

    async create(dto: CreateOrderDto) {
        const { userId, cartId, paymentTransactionId, totalAmount } = dto;

        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) throw new BadRequestException('User ID is required or invalid');

        const cart = await this.cartsRepo.findOne({
            where: { id: cartId },
            relations: ['items', 'items.product'],
        });
        if (!cart) throw new BadRequestException('Invalid cart ID');

        const payment = await this.paymentsRepo.findOne({
            where: { id: paymentTransactionId },
        });
        if (!payment) throw new BadRequestException('Invalid paymentTransactionId');

        const orderStatus = payment.status === 'success' ? 'completed' : 'pending';
        const order = this.ordersRepo.create({
            user,
            cart,
            paymentTransaction: payment,
            totalAmount: cart.items.reduce((sum, item) => sum + Number(item.total), 0),
            status: orderStatus,
        });

        return this.ordersRepo.save(order);
    }

    async findAll() {
        return this.ordersRepo.find({
            relations: ['user', 'cart', 'paymentTransaction'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByUser(userId: string) {
        const orders = await this.ordersRepo.find({
            where: { user: { id: userId } },
            relations: ['cart', 'cart.items', 'cart.items.product', 'paymentTransaction'],
            order: { createdAt: 'DESC' },
        });

        if (!orders.length) {
            throw new NotFoundException('No orders found for this user');
        }

        return orders;
    }

    async findOne(id: string) {
        const order = await this.ordersRepo.findOne({
            where: { id },
            relations: ['user', 'cart', 'cart.items', 'cart.items.product', 'paymentTransaction'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto) {
        const order = await this.ordersRepo.findOne({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');

        order.status = dto.status;
        return this.ordersRepo.save(order);
    }

    async remove(id: string) {
        const order = await this.ordersRepo.findOne({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');

        await this.ordersRepo.remove(order);
        return { message: 'Order deleted successfully' };
    }
}


