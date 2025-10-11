import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./dal/entities/product.entity"; 
import { Category } from "./dal/entities/category.entity"; 
import { User } from "./dal/entities/user.entity";
import { Admin } from "./dal/entities/admin.entity";
import { Cart } from "./dal/entities/cart.entity";
import { CartItem } from "./dal/entities/cart-item.entity";
import { PaymentTransaction } from "./dal/entities/payment-transaction.entity";
import { Order } from "./dal/entities/order.entity";

export const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "e-commerce",
    synchronize: false, 
    logging: true,
    entities: [Product, Category, Admin, User, Cart, CartItem, PaymentTransaction, Order], 
     migrations: ["dist/migrations/*.js"],
    subscribers: [],
});


