// src/index.ts
import "reflect-metadata"; // MUST BE FIRST
import { createConnection } from "typeorm";
import { Transaction } from "./entities/Transaction";
import { WalletHolder } from "./entities/WalletHolder";

async function main() {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Transaction, WalletHolder],
    synchronize: true,
  });

  console.log("DB connected");
}

main().catch(console.error);
