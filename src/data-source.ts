import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Product } from './dal/entities/product.entity';
import { Category } from './dal/entities/category.entity';
import { User } from './dal/entities/user.entity';
import { Admin } from './dal/entities/admin.entity';
import { Cart } from './dal/entities/cart.entity';
import { CartItem } from './dal/entities/cart-item.entity';
import { PaymentTransaction } from './dal/entities/payment-transaction.entity';
import { Order } from './dal/entities/order.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const config: DataSourceOptions = {
    type: 'postgres',
    ...(process.env.DATABASE_URL
        ? {
            url: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASS || 'postgres',
            database: process.env.DB_NAME || 'e-commerce',
        }),
    synchronize: false,
    logging: true,
    entities: [
        Product,
        Category,
        Admin,
        User,
        Cart,
        CartItem,
        PaymentTransaction,
        Order,
    ],
    // support TS when running with ts-node (dev) and JS when running built code (prod)
    migrations: ['src/migrations/*.ts', 'dist/migrations/*.js'],
    subscribers: [],
};
 
export const dataSource = new DataSource(config);



