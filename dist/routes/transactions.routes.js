"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../config/data-source");
const Transaction_1 = require("../entities/Transaction");
const router = (0, express_1.Router)();
router.get('/transactions', async (_req, res) => {
    try {
        const repo = data_source_1.AppDataSource.getRepository(Transaction_1.Transaction);
        const transactions = await repo.find({ order: { timestamp: 'DESC' } });
        res.json(transactions); // ✅ just call res.json, don't return
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/transactions/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid transaction ID' });
        return;
    }
    try {
        const repo = data_source_1.AppDataSource.getRepository(Transaction_1.Transaction);
        const transaction = await repo.findOneBy({ id });
        if (!transaction) {
            res.status(404).json({ error: 'Transaction not found' });
        }
        else {
            res.json(transaction);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
