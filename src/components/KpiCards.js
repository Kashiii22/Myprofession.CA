'use client';
import { useSelector } from 'react-redux';

export default function KpiCards() {
  const mentors = useSelector((state) => state.mentors.items);
  const pendingCount = mentors.filter((m) => m.status === 'pending').length;
  const approvedCount = mentors.filter((m) => m.status === 'approved').length;
  const approvalRate = mentors.length
    ? Math.round((approvedCount / mentors.length) * 100)
    : 0;

  const cards = [
    {
      label: 'Pending',
      value: pendingCount,
      bg: 'bg-yellow-500',
      text: 'text-black',
    },
    {
      label: 'Approved',
      value: approvedCount,
      bg: 'bg-green-600',
      text: 'text-white',
    },
    {
      label: 'Approval Rate',
      value: `${approvalRate}%`,
      bg: 'bg-indigo-600',
      text: 'text-white',
    },
    {
      label: 'Est. Revenue',
      value: '₹0 (mock)',
      bg: 'bg-pink-500',
      text: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6 mt-20">
      {cards.map(({ label, value, bg, text }) => (
        <div
          key={label}
          className={`${bg} ${text} p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-default`}
          aria-label={`${label} count`}
        >
          <div className="text-4xl font-extrabold">{value}</div>
          <div className="mt-2 text-lg font-medium">{label}</div>
        </div>
      ))}
    </div>
  );
}
