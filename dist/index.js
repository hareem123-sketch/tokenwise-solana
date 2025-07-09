"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const data_source_js_1 = require("./config/data-source.js");
const stats_routes_js_1 = __importDefault(require("./routes/stats.routes.js"));
const transactions_routes_js_1 = __importDefault(require("./routes/transactions.routes.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ Register routes
app.use('/api', stats_routes_js_1.default);
app.use('/api', transactions_routes_js_1.default);
// ✅ Health check route
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// ✅ Root route
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.send('Hello! Your server is running.');
});
// ❌ Catch-all for undefined routes
app.use((req, res) => {
    console.log(`No route matched: ${req.method} ${req.url}`);
    res.status(404).send(`Cannot ${req.method} ${req.url}`);
});
// ✅ Initialize DB and start server
data_source_js_1.AppDataSource.initialize()
    .then(() => {
    console.log('📦 DB connected');
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ Failed to initialize DB:', err?.stack || err);
});
