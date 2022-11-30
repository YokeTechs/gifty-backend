export interface IDatabase {
  postgres: ISQL;
}

export interface ISQL {
  user: string;
  dbName: string;
  host: string;
  password: string;
  port: number;
}

export interface IConfig {
  port: number;
  database: IDatabase;
}
