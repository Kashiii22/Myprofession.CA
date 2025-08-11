import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearchFilter,
  setStatusFilter,
  setPaymentMethodFilter,
  setTypeFilter,
  setDateRangeFilter,
  toggleSelect,
  selectAll,
  clearSelection,
  updateStatusBulk,
} from '../redux/transactionsSlice';

export default function TransactionsTable() {
  const dispatch = useDispatch();
  const { items, filters, selectedIds } = useSelector(state => state.transactions);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal for details
  const [detailsTxn, setDetailsTxn] = useState(null);

  // Filter transactions
  const filtered = useMemo(() => {
    return items.filter(txn => {
      if (filters.status !== 'all' && txn.status !== filters.status) return false;
      if (filters.paymentMethod !== 'all' && txn.paymentMethod !== filters.paymentMethod) return false;
      if (filters.type !== 'all' && txn.type !== filters.type) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (
          !txn.id.toLowerCase().includes(s) &&
          !txn.user.toLowerCase().includes(s) &&
          !txn.orderId.toLowerCase().includes(s)
        ) return false;
      }
      if (filters.dateRange.start) {
        if (new Date(txn.date) < new Date(filters.dateRange.start)) return false;
      }
      if (filters.dateRange.end) {
        if (new Date(txn.date) > new Date(filters.dateRange.end)) return false;
      }
      return true;
    });
  }, [items, filters]);

  // Pagination slice
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const toggleSelectAll = (e) => {
    if (e.target.checked) dispatch(selectAll());
    else dispatch(clearSelection());
  };

  const toggleSelectOne = (id) => {
    dispatch(toggleSelect(id));
  };

  const bulkUpdateStatus = (status) => {
    if (selectedIds.length === 0) {
      alert('Select at least one transaction');
      return;
    }
    dispatch(updateStatusBulk({ ids: selectedIds, status }));
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Txn ID, User, Order ID"
          className="bg-gray-900 text-white rounded p-2 flex-grow min-w-[200px]"
          value={filters.search}
          onChange={(e) => dispatch(setSearchFilter(e.target.value))}
        />
        <select
          value={filters.status}
          onChange={(e) => dispatch(setStatusFilter(e.target.value))}
          className="bg-gray-900 text-white rounded p-2"
        >
          <option value="all">All Statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
        <select
          value={filters.paymentMethod}
          onChange={(e) => dispatch(setPaymentMethodFilter(e.target.value))}
          className="bg-gray-900 text-white rounded p-2"
        >
          <option value="all">All Payment Methods</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Wallet">Wallet</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="PayPal">PayPal</option>
        </select>
        <select
          value={filters.type}
          onChange={(e) => dispatch(setTypeFilter(e.target.value))}
          className="bg-gray-900 text-white rounded p-2"
        >
          <option value="all">All Types</option>
          <option value="purchase">Purchase</option>
          <option value="refund">Refund</option>
          <option value="transfer">Transfer</option>
        </select>
        {/* Date inputs */}
        <input
          type="date"
          value={filters.dateRange.start || ''}
          onChange={(e) =>
            dispatch(setDateRangeFilter({ ...filters.dateRange, start: e.target.value || null }))
          }
          className="bg-gray-900 text-white rounded p-2"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={filters.dateRange.end || ''}
          onChange={(e) =>
            dispatch(setDateRangeFilter({ ...filters.dateRange, end: e.target.value || null }))
          }
          className="bg-gray-900 text-white rounded p-2"
          placeholder="End Date"
        />
      </div>

      {/* Bulk actions */}
      <div className="mb-4 flex items-center gap-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={selectedIds.length === items.length && items.length > 0}
            onChange={toggleSelectAll}
            className="form-checkbox"
          />
          <span className="ml-2">Select All</span>
        </label>

        <button
          onClick={() => bulkUpdateStatus('refunded')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded disabled:opacity-50"
          disabled={selectedIds.length === 0}
        >
          Bulk Refund
        </button>
        <button
          onClick={() => bulkUpdateStatus('success')}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
          disabled={selectedIds.length === 0}
        >
          Bulk Mark Success
        </button>
        <button
          onClick={() => bulkUpdateStatus('failed')}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
          disabled={selectedIds.length === 0}
        >
          Bulk Mark Failed
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length === items.length && items.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-300">Txn ID</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-300">User</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-300">Payment Method</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-300">Amount</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-300">Status</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-300">Date</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-6 text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              paginated.map(txn => (
                <tr
                  key={txn.id}
                  className="hover:bg-gray-700 cursor-pointer"
                  onClick={() => setDetailsTxn(txn)}
                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(txn.id)}
                      onChange={e => {
                        e.stopPropagation();
                        toggleSelectOne(txn.id);
                      }}
                      onClick={e => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-3 py-2">{txn.id}</td>
                  <td className="px-3 py-2">{txn.user}</td>
                  <td className="px-3 py-2">{txn.paymentMethod}</td>
                  <td className="px-3 py-2">{txn.currency}{txn.amount}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={txn.status} />
                  </td>
                  <td className="px-3 py-2">{new Date(txn.date).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setDetailsTxn(txn);
                      }}
                      className="bg-blue-600 px-2 py-1 rounded text-white text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {detailsTxn && (
        <DetailsModal txn={detailsTxn} onClose={() => setDetailsTxn(null)} />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  let color = 'bg-gray-600';
  switch (status) {
    case 'success': color = 'bg-green-600'; break;
    case 'failed': color = 'bg-red-600'; break;
    case 'pending': color = 'bg-yellow-500 text-black'; break;
    case 'refunded': color = 'bg-purple-600'; break;
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color} text-white`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function DetailsModal({ txn, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="txn-details-title"
    >
      <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg relative">
        <h2 id="txn-details-title" className="text-xl font-bold mb-4 text-white">
          Transaction Details: {txn.id}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          aria-label="Close details modal"
        >
          ✕
        </button>
        <div className="space-y-2 text-gray-300">
          <p><strong>User:</strong> {txn.user}</p>
          <p><strong>Payment Method:</strong> {txn.paymentMethod}</p>
          <p><strong>Amount:</strong> {txn.currency}{txn.amount}</p>
          <p><strong>Status:</strong> {txn.status}</p>
          <p><strong>Date:</strong> {new Date(txn.date).toLocaleString()}</p>
          <p><strong>Type:</strong> {txn.type}</p>
          <p><strong>Order ID:</strong> {txn.orderId}</p>
          <p><strong>Gateway:</strong> {txn.gateway}</p>
          <p><strong>IP Address:</strong> {txn.ip}</p>
          <p><strong>Device:</strong> {txn.device}</p>
          <p><strong>Details:</strong> {txn.details}</p>

          <div>
            <h3 className="font-semibold mt-4 mb-2 text-white">Audit Trail:</h3>
            <ul className="list-disc list-inside text-sm">
              {txn.auditTrail.length === 0
                ? <li>No audit records</li>
                : txn.auditTrail.map((record, idx) => (
                  <li key={idx}>
                    {new Date(record.date).toLocaleString()} — {record.action} by {record.by}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
