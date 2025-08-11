'use client';

import React from 'react';
import Sidebar from '@/components/AdminSidebar';
import Header from '@/components/Header';
import TransactionKpiCards from '@/components/TransactionKpiCards';
import TransactionsTable from '@/components/TransactionTable';

export default function TransactionsPage() {
  return (
    <div className="bg-black min-h-screen text-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <Sidebar className="md:h-screen md:w-64 w-full shrink-0" />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Transactions</h1>
          <TransactionKpiCards />
          <TransactionsTable />
        </main>
      </div>
    </div>
  );
}
