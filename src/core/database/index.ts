import {DataSource} from "typeorm";
import {EventEntity, LuckyNumberEntity, UserEntity} from "../entities";
import config from "../config";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.database.postgres.host,
    port: config.database.postgres.port,
    username: config.database.postgres.user,
    password: config.database.postgres.password,
    database: config.database.postgres.dbName,
    synchronize: true,
    logging: true,
    entities: [EventEntity, UserEntity, LuckyNumberEntity],
    subscribers: [],
    migrations: [],
});

export const EventRepo = AppDataSource.getRepository(EventEntity);
export const UserRepo = AppDataSource.getRepository(UserEntity);
export const LuckyNumberRepo = AppDataSource.getRepository(LuckyNumberEntity);