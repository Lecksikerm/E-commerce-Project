import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions, LoggerOptions } from 'typeorm';
import * as Entities from '../dal';

// const dotenv_path = path.resolve(process.cwd(), '.env');
// dotenv.config({ path: dotenv_path });

const dotenv_path = path.resolve(process.cwd(), '.env');
dotenv.config({ path: dotenv_path });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'e-commerce',
  entities: Object.values(Entities),
  migrations: [path.join(__dirname, 'migrations/*.ts')],
  logging: process.env.TYPEORM_LOGGING as LoggerOptions,
  ssl: {
    rejectUnauthorized: false,
  },
};

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization!', err);
  });

export default dataSource;
