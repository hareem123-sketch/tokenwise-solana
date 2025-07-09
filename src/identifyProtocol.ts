// src/identifyProtocol.ts
import { PROGRAM_IDS } from './config/protocols';
import { connection } from './solana';
import { PublicKey } from '@solana/web3.js';

export async function identifyProtocolActivity(accountAddress: string): Promise<void> {
  const pubkey = new PublicKey(accountAddress);

  const recentTxs = await connection.getSignaturesForAddress(pubkey, { limit: 5 });

  for (const tx of recentTxs) {
    const parsedTx = await connection.getParsedTransaction(tx.signature, 'confirmed');
    if (!parsedTx || !parsedTx.meta) continue;

    const logMessages = parsedTx.meta.logMessages ?? [];
    const instructions = parsedTx.transaction.message.instructions;

    const involvedPrograms = new Set<string>();

    // From logs
    for (const log of logMessages) {
      if (log.includes(PROGRAM_IDS.jupiter)) involvedPrograms.add('Jupiter');
      if (log.includes(PROGRAM_IDS.raydium)) involvedPrograms.add('Raydium');
      if (log.includes(PROGRAM_IDS.orca)) involvedPrograms.add('Orca');
    }

    // From instructions
    for (const ix of instructions) {
      const programId = 'programId' in ix ? ix.programId.toBase58() : null;
      if (!programId) continue;

      if (programId === PROGRAM_IDS.jupiter) involvedPrograms.add('Jupiter');
      if (programId === PROGRAM_IDS.raydium) involvedPrograms.add('Raydium');
      if (programId === PROGRAM_IDS.orca) involvedPrograms.add('Orca');
    }

    if (involvedPrograms.size > 0) {
      console.log(`🔍 Protocols involved in tx ${tx.signature}: ${[...involvedPrograms].join(', ')}`);
    }
  }
}
