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
const isProduction = process.env.NODE_ENV === "production";

const dbUrl =
  process.env.DATABASE_URL ||
  `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export const dataSource = new DataSource({
  type: "postgres",
  url: dbUrl,
  synchronize: false,
  logging: true,
  entities: [Product, Category, Admin, User, Cart, CartItem, PaymentTransaction, Order],
  migrations: ["dist/migrations/*.js"],
  subscribers: [],
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});








