import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entities/product.entity"; // adjust path
import { Category } from "./entities/category.entity"; // adjust path
import { User } from "./entities/user.entity";
import { Admin } from "./admin/admin.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "e-commerce",
    synchronize: false, // migrations handle schema
    logging: true,
    entities: [Product, Category, Admin], // add all your entities here
    migrations: ["src/migrations/*.ts"], 
    subscribers: [],
});
