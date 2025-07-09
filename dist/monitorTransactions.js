"use strict";
// src/monitorTransactions.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMonitoring = startMonitoring;
const fetchTopHolders_1 = require("./fetchTopHolders");
const data_source_1 = require("./config/data-source");
const WalletHolder_1 = require("./entities/WalletHolder");
const identifyProtocol_1 = require("./identifyProtocol"); // make sure this exists
const POLL_INTERVAL = 15000; // 15 seconds
const tokenMint = 'YOUR_TOKEN_MINT_ADDRESS';
let previousBalances = new Map();
async function startMonitoring() {
    await data_source_1.AppDataSource.initialize();
    setInterval(async () => {
        try {
            const topHolders = await (0, fetchTopHolders_1.fetchTopHolders)(tokenMint);
            const repo = data_source_1.AppDataSource.getRepository(WalletHolder_1.WalletHolder);
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
                    }
                    else {
                        entity.amount = newBalance;
                    }
                    await repo.save(entity);
                    // Trigger protocol detection
                    await (0, identifyProtocol_1.identifyProtocolActivity)(address);
                }
                // Update the balance map
                previousBalances.set(address, newBalance);
            }
        }
        catch (err) {
            console.error('❌ Error in monitoring loop:', err);
        }
    }, POLL_INTERVAL);
}
