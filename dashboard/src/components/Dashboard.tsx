import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface WalletActivity {
  wallet: string; // adjust key name to match backend
  count: string;  // SQL count comes as string
}

interface ProtocolUsage {
  protocol: string;
  count: string;
}

interface Stats {
  totalBuys: number;
  totalSells: number;
  netDirection: string;
  walletsWithRepeatedActivity: WalletActivity[];
  protocolUsage: ProtocolUsage[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/transactions/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!stats) return null;

  return (
    <div>
      <h2>Buy vs Sell</h2>
      <Pie
        data={{
          labels: ['Buy', 'Sell'],
          datasets: [{
            data: [stats.totalBuys, stats.totalSells],
            backgroundColor: ['#4caf50', '#f44336'],
          }],
        }}
      />

      <h3>Net Direction: {stats.netDirection}</h3>

      <h2>Wallets with Repeated Activity</h2>
      <Bar
        data={{
          labels: stats.walletsWithRepeatedActivity.map(w => w.wallet),
          datasets: [{
            label: '# of Transactions',
            data: stats.walletsWithRepeatedActivity.map(w => Number(w.count)),
            backgroundColor: '#2196f3',
          }],
        }}
      />

      <h2>Protocol Usage</h2>
      <Pie
        data={{
          labels: stats.protocolUsage.map(p => p.protocol),
          datasets: [{
            data: stats.protocolUsage.map(p => Number(p.count)),
            backgroundColor: ['#ff9800', '#9c27b0', '#00bcd4'],
          }],
        }}
      />
    </div>
  );
};

export default Dashboard;
