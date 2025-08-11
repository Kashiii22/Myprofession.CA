export default function StatusBadge({ status }) {
  const color =
    status === 'approved'
      ? 'bg-green-600'
      : status === 'pending'
      ? 'bg-yellow-600'
      : 'bg-red-600';
  return <span className={`${color} px-2 py-1 rounded text-xs`}>{status}</span>;
}
