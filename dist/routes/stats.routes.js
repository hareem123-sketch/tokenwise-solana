"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_js_1 = require("../config/data-source.js");
const router = (0, express_1.Router)();
router.get('/transactions/stats', async (_req, res) => {
    try {
        const result = await data_source_js_1.AppDataSource.query('SELECT COUNT(*) as count FROM transactions');
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching transaction stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
