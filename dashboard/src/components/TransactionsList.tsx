// src/components/TransactionsList.tsx

import React from 'react';
import { useTransactions } from '../hooks/useTransactions';

export default function TransactionsList() {
  const { transactions, loading, error } = useTransactions();

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error}</p>;
  if (transactions.length === 0) return <p>No transactions found.</p>;

  return (
    <ul>
      {transactions.map((tx) => (
        <li key={tx.id}>
          #{tx.id} — Amount: {tx.amount} — Date: {new Date(tx.timestamp).toLocaleString()}
        </li>
      ))}
    </ul>
  );
}
