"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTopHolders = fetchTopHolders;
// src/fetchTopHolders.ts
const web3_js_1 = require("@solana/web3.js");
const solana_1 = require("./solana");
async function fetchTopHolders(tokenMint) {
    const mint = new web3_js_1.PublicKey(tokenMint);
    const tokenAccounts = await solana_1.connection.getTokenLargestAccounts(mint);
    return tokenAccounts.value.slice(0, 60); // top 60
}
