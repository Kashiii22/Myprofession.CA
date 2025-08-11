import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    // Sample transaction data for demo
    {
      id: 'TXN001',
      user: 'John Doe',
      paymentMethod: 'Credit Card',
      amount: 1200,
      currency: '₹',
      status: 'success', // success | failed | pending | refunded
      date: '2025-08-10T14:23:00Z',
      type: 'purchase',
      orderId: 'ORD123',
      gateway: 'Stripe',
      ip: '192.168.1.1',
      device: 'Chrome on Windows',
      details: 'Bought 3 courses',
      auditTrail: [
        { date: '2025-08-10T14:23:00Z', action: 'Created', by: 'system' },
        { date: '2025-08-10T14:30:00Z', action: 'Approved', by: 'admin' },
      ],
    },
    {
      id: 'TXN002',
      user: 'Jane Smith',
      paymentMethod: 'Wallet',
      amount: 800,
      currency: '₹',
      status: 'pending',
      date: '2025-08-11T09:12:00Z',
      type: 'purchase',
      orderId: 'ORD124',
      gateway: 'PayPal',
      ip: '192.168.1.5',
      device: 'Firefox on Mac',
      details: 'Bought 1 course',
      auditTrail: [],
    },
    // Add more...
  ],
  filters: {
    search: '',
    status: 'all', // all | success | failed | pending | refunded
    paymentMethod: 'all',
    type: 'all',
    dateRange: { start: null, end: null },
  },
  selectedIds: [], // for bulk actions
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setSearchFilter(state, action) {
      state.filters.search = action.payload;
    },
    setStatusFilter(state, action) {
      state.filters.status = action.payload;
    },
    setPaymentMethodFilter(state, action) {
      state.filters.paymentMethod = action.payload;
    },
    setTypeFilter(state, action) {
      state.filters.type = action.payload;
    },
    setDateRangeFilter(state, action) {
      state.filters.dateRange = action.payload; // { start: Date|null, end: Date|null }
    },
    toggleSelect(state, action) {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(i => i !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    selectAll(state) {
      state.selectedIds = state.items.map(i => i.id);
    },
    clearSelection(state) {
      state.selectedIds = [];
    },
    updateStatusBulk(state, action) {
      const { ids, status } = action.payload;
      state.items = state.items.map(txn =>
        ids.includes(txn.id) ? { ...txn, status } : txn
      );
      state.selectedIds = [];
    },
    // More reducers like export can be added
  },
});

export const {
  setSearchFilter,
  setStatusFilter,
  setPaymentMethodFilter,
  setTypeFilter,
  setDateRangeFilter,
  toggleSelect,
  selectAll,
  clearSelection,
  updateStatusBulk,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
