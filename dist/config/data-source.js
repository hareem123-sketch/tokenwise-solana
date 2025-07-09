"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Transaction_js_1 = require("../entities/Transaction.js");
const WalletHolder_js_1 = require("../entities/WalletHolder.js");
console.log('DATABASE_URL:', process.env.DATABASE_URL);
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [Transaction_js_1.Transaction, WalletHolder_js_1.WalletHolder],
    migrations: [],
    subscribers: [],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
    // your app start logic here
})
    .catch((error) => {
    console.error('Error during Data Source initialization:', error);
});
