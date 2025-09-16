import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";


const config: PostgresConnectionOptions ={
  type: "postgres",
  database: "e-commerce",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  entities: ["User" ],
  synchronize: true,

};