import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./dal/entities/product.entity"; // adjust path
import { Category } from "./dal/entities/category.entity"; // adjust path
import { User } from "./dal/entities/user.entity";
import { Admin } from "./dal/entities/admin.entity";

export const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "e-commerce",
    synchronize: false, // migrations handle schema
    logging: true,
    entities: [Product, Category, Admin, User], // add all your entities here
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});


