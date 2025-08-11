import React from 'react';
import { useSelector } from 'react-redux';

export default function TransactionKpiCards() {
  const transactions = useSelector(state => state.transactions.items);

  const totalCount = transactions.length;
  const totalVolume = transactions.reduce((a, b) => a + b.amount, 0);
  const successCount = transactions.filter(t => t.status === 'success').length;
  const failedCount = transactions.filter(t => t.status === 'failed').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const refundedCount = transactions.filter(t => t.status === 'refunded').length;
  const avgValue = totalCount ? (totalVolume / totalCount).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      <Card title="Total Transactions" value={totalCount} color="bg-blue-600" />
      <Card title="Total Volume" value={`₹${totalVolume}`} color="bg-green-600" />
      <Card title="Success" value={successCount} color="bg-green-500" />
      <Card title="Failed" value={failedCount} color="bg-red-600" />
      <Card title="Pending" value={pendingCount} color="bg-yellow-500" />
      <Card title="Refunded" value={refundedCount} color="bg-purple-600" />
      <Card title="Avg Transaction Value" value={`₹${avgValue}`} color="bg-indigo-600" />
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`${color} text-white p-4 rounded-lg shadow-md flex flex-col justify-center`}>
      <h3 className="text-sm font-semibold uppercase">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
