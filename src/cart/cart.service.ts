import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../dal/entities/cart.entity';
import { CartItem } from '../dal/entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Product } from '../dal/entities/product.entity';
import { User } from '../dal/entities/user.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private readonly itemRepo: Repository<CartItem>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) { }


    async getCart(userId: string) {
        let cart = await this.cartRepo.findOne({
            where: { user: { id: userId }, status: 'active' },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) throw new NotFoundException('User not found');
            cart = await this.cartRepo.save(this.cartRepo.create({ user, status: 'active', items: [] }));
            cart.items = [];
        }

        const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        return {
            id: cart.id,
            status: cart.status,
            items: cart.items,
            subtotal,
            total: subtotal,
        };
    }

    async addToCart(userId: string, dto: AddToCartDto) {
        const product = await this.productRepo.findOneBy({ id: dto.productId });
        if (!product) throw new NotFoundException('Product not found');
        if (product.stock < dto.quantity) throw new BadRequestException('Not enough stock');

        let cart = await this.cartRepo.findOne({
            where: { user: { id: userId }, status: 'active' },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) throw new NotFoundException('User not found');
            cart = await this.cartRepo.save(this.cartRepo.create({ user, status: 'active' }));
            cart.items = [];
        }

        let item = cart.items.find((i) => i.product.id === dto.productId);
        if (item) {
            item.quantity += dto.quantity;
            item.total = item.quantity * item.price;
        } else {
            item = this.itemRepo.create({
                cart,
                product,
                quantity: dto.quantity,
                price: Number(product.price),
                total: dto.quantity * Number(product.price),
            });
            cart.items.push(item);
        }

        await this.itemRepo.save(item);
        return this.getCart(userId);
    }

    async updateCartItem(itemId: string, dto: UpdateCartItemDto) {
        const item = await this.itemRepo.findOne({
            where: { id: itemId },
            relations: ['product', 'cart', 'cart.user'],
        });
        if (!item) throw new NotFoundException('Cart item not found');

        if (dto.quantity === 0) {
            await this.itemRepo.remove(item);
        } else {
            if (item.product.stock < dto.quantity) throw new BadRequestException('Not enough stock');
            item.quantity = dto.quantity;
            item.total = item.price * dto.quantity;
            await this.itemRepo.save(item);
        }

        return this.getCart(item.cart.user.id);
    }


    async removeCartItem(itemId: string) {
        const item = await this.itemRepo.findOne({ where: { id: itemId } });
        if (!item) throw new NotFoundException('Cart item not found');
        await this.itemRepo.remove(item);
        return { message: 'Item removed from cart' };
    }

    async clearCart(userId: string) {
        const cart = await this.cartRepo.findOne({
            where: { user: { id: userId }, status: 'active' },
            relations: ['items'],
        });

        if (!cart || cart.items.length === 0) {
            return { message: 'Cart already empty' };
        }

        await this.itemRepo.remove(cart.items);
        return { message: 'Cart cleared' };
    }
}

