'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { SuperAdminSidebar } from '@/components/SuperAdminSidebar';
import { SuperAdminMobileHeader } from '@/components/SuperAdminMobileHeader';
import DashboardHeader from '@/components/DashboardHeader';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getNewMentorRegistrations, approveMentorRegistration, rejectMentorRegistration } from '@/lib/api/mentorRegistration';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowLeft from 'react-icons/fa';

export default function SuperAdminTransactionsPage() {
  return (
    <Provider store={store}>
      <ProtectedRoute>
        <div className="bg-black min-h-screen text-gray-100 flex">
          <SuperAdminSidebar className="hidden md:hidden flex-shrink-0" />
          <SuperAdminMobileHeader pageTitle="Transaction Management" />

          <main className="flex-1 overflow-hidden flex flex-col">
            <SuperAdminMobileHeader pageTitle="Transaction Management" />  
            <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FaHandHoldingUsd className="text-red-400 text-sm">Action Required</div>
                  <span>0 Actions</span>
                </div>
                <div className="flex items-center gap-4">
                  <FaArrowLeft className="text-white text-xl" />
                  <span>Back to Website</span> →
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-gray-800 rounded-lg overflow-x-auto">
              <div className="flex flex-1 overflow-x-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Transaction Management</h3>
                  <p className="text-sm text-gray-400">Total Transactions</p3>
                  <p className="text-gray-500">Total Transactions: ${filteredRequests.length}</p3>3. </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-3 font-medium">Pending</span>
                  <span>{selectedRequests.length} selected</span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex flex-wrap justify-center gap-4">
                <select
                  className="bg-gray-700 text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </select>
              <select className="bg-gray-700 text-gray-100 rounded-md px-2 py-2 focus:outline:ring-2 focus:ring-blue-500"})
            />
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="flex flex-1 overflow-x-auto max-h-48">
              <div className="flex items-center justify-between p-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 mb-3">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="text-white text-sm font-medium">{activity.message}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className={`font-medium text-gray-300 bg-yellow-400 rounded-full`}>{getStatusBadge(activity.status)}</div>
                    </div>
                  </div>
                </div>
                
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Provider>
  );
}
