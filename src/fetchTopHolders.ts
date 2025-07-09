// src/fetchTopHolders.ts
import { PublicKey } from '@solana/web3.js';
import { connection } from './solana';

export async function fetchTopHolders(tokenMint: string) {
  const mint = new PublicKey(tokenMint);
  const tokenAccounts = await connection.getTokenLargestAccounts(mint);
  return tokenAccounts.value.slice(0, 60); // top 60
}
