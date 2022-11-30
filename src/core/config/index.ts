import { IConfig } from './interface';
import { config as DotenvConfig } from 'dotenv';
import config from 'config';

function configuration() {
  DotenvConfig();
  let cfg: IConfig = {
    port: config.get('port'),
    database: {
      postgres: {
        ...config.get('database.postgres'),
        password: String(process.env.POSTGRES_PASSWORD),
      },
    },
  };

  return cfg;
}

export default configuration();
