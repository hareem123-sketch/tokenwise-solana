import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Transaction } from '../entities/Transaction.js';
import { WalletHolder } from '../entities/WalletHolder.js';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [Transaction, WalletHolder],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    // your app start logic here
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });
