import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Transaction } from '../entities/Transaction';
import { Parser } from 'json2csv';

const router = Router();

// Stats route
router.get('/transactions/stats', async (_req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Transaction);

    const buysCount = await repo.count({ where: { type: 'buy' } });
    const sellsCount = await repo.count({ where: { type: 'sell' } });
    const netDirection = buysCount > sellsCount ? 'buy-heavy' : (sellsCount > buysCount ? 'sell-heavy' : 'neutral');

    const walletsWithActivity = await repo
      .createQueryBuilder('transaction')
      .select('transaction.wallet')
      .addSelect('COUNT(transaction.wallet)', 'count')
      .groupBy('transaction.wallet')
      .having('COUNT(transaction.wallet) > 1')
      .getRawMany();

    const protocolUsage = await repo
      .createQueryBuilder('transaction')
      .select('transaction.protocol')
      .addSelect('COUNT(transaction.protocol)', 'count')
      .groupBy('transaction.protocol')
      .getRawMany();

    res.json({
      totalBuys: buysCount,
      totalSells: sellsCount,
      netDirection,
      walletsWithRepeatedActivity: walletsWithActivity,
      protocolUsage,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CSV export route
router.get('/export/transactions', async (_req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Transaction);
    const data = await repo.find();

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Error generating CSV');
  }
});

export default router;
