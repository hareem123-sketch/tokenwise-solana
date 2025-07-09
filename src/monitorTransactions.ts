// src/monitorTransactions.ts

import { fetchTopHolders } from './fetchTopHolders';
import { PublicKey } from '@solana/web3.js';
import { connection } from './solana';
import { AppDataSource } from './config/data-source';
import { WalletHolder } from './entities/WalletHolder';
import { identifyProtocolActivity } from './identifyProtocol'; // make sure this exists

const POLL_INTERVAL = 15000; // 15 seconds
const tokenMint = 'YOUR_TOKEN_MINT_ADDRESS';

let previousBalances = new Map<string, number>();

export async function startMonitoring() {
  await AppDataSource.initialize();

  setInterval(async () => {
    try {
      const topHolders = await fetchTopHolders(tokenMint);
      const repo = AppDataSource.getRepository(WalletHolder);

      for (const holder of topHolders) {
        const address = holder.address.toBase58();
        const newBalance = parseFloat(holder.amount);
        const oldBalance = previousBalances.get(address) ?? newBalance;

        const diff = newBalance - oldBalance;

        if (Math.abs(diff) > 0) {
          console.log(`📈 ${address} balance changed by ${diff}`);

          // Store new balance in DB
          let entity = await repo.findOneBy({ walletAddress: address, tokenMint });
          if (!entity) {
            entity = repo.create({ walletAddress: address, amount: newBalance, tokenMint });
          } else {
            entity.amount = newBalance;
          }
          await repo.save(entity);

          // Trigger protocol detection
          await identifyProtocolActivity(address);
        }

        // Update the balance map
        previousBalances.set(address, newBalance);
      }
    } catch (err) {
      console.error('❌ Error in monitoring loop:', err);
    }
  }, POLL_INTERVAL);
}
