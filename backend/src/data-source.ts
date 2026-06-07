import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "192.168.1.12",
    port: 3306,
    username: "geomundo_dev",
    password: "GeoDev2026!",
    database: "geomundo_db",
    synchronize: false,
    logging: true,
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
});