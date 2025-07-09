"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyProtocolActivity = identifyProtocolActivity;
// src/identifyProtocol.ts
const protocols_1 = require("./config/protocols");
const solana_1 = require("./solana");
const web3_js_1 = require("@solana/web3.js");
async function identifyProtocolActivity(accountAddress) {
    const pubkey = new web3_js_1.PublicKey(accountAddress);
    const recentTxs = await solana_1.connection.getSignaturesForAddress(pubkey, { limit: 5 });
    for (const tx of recentTxs) {
        const parsedTx = await solana_1.connection.getParsedTransaction(tx.signature, 'confirmed');
        if (!parsedTx || !parsedTx.meta)
            continue;
        const logMessages = parsedTx.meta.logMessages ?? [];
        const instructions = parsedTx.transaction.message.instructions;
        const involvedPrograms = new Set();
        // From logs
        for (const log of logMessages) {
            if (log.includes(protocols_1.PROGRAM_IDS.jupiter))
                involvedPrograms.add('Jupiter');
            if (log.includes(protocols_1.PROGRAM_IDS.raydium))
                involvedPrograms.add('Raydium');
            if (log.includes(protocols_1.PROGRAM_IDS.orca))
                involvedPrograms.add('Orca');
        }
        // From instructions
        for (const ix of instructions) {
            const programId = 'programId' in ix ? ix.programId.toBase58() : null;
            if (!programId)
                continue;
            if (programId === protocols_1.PROGRAM_IDS.jupiter)
                involvedPrograms.add('Jupiter');
            if (programId === protocols_1.PROGRAM_IDS.raydium)
                involvedPrograms.add('Raydium');
            if (programId === protocols_1.PROGRAM_IDS.orca)
                involvedPrograms.add('Orca');
        }
        if (involvedPrograms.size > 0) {
            console.log(`🔍 Protocols involved in tx ${tx.signature}: ${[...involvedPrograms].join(', ')}`);
        }
    }
}
