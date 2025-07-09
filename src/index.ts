import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { AppDataSource } from './config/data-source.js';
import statsRoutes from './routes/stats.routes.js';
import transactionsRoutes from './routes/transactions.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Register routes
app.use('/api', statsRoutes);
app.use('/api', transactionsRoutes);

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
AppDataSource.initialize()
  .then(() => {
    console.log('📦 DB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('❌ Failed to initialize DB:', err?.stack || err);
  });
