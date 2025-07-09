import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Transaction } from '../entities/Transaction';

const router = Router();

router.get('/transactions', async (_req: Request, res: Response): Promise<void> => {
  try {
    const repo = AppDataSource.getRepository(Transaction);
    const transactions = await repo.find({ order: { timestamp: 'DESC' } });
    res.json(transactions); // ✅ just call res.json, don't return
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/transactions/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid transaction ID' });
    return;
  }

  try {
    const repo = AppDataSource.getRepository(Transaction);
    const transaction = await repo.findOneBy({ id });
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
    } else {
      res.json(transaction);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
