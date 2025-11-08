'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import SuperAdminSidebar from '@/components/SuperAdminSidebar';
import SuperAdminMobileHeader from '@/components/SuperAdminMobileHeader';
import DashboardHeader from '@/components/DashboardHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getNewMentorRegistrations, approveMentorRegistration, rejectMentorRegistration } from '@/lib/api/mentorRegistration';
import toast, { Toaster } from 'react-hot-toast';

export default function SuperAdminSettingsPage() {
  return (
    <Provider store={store}>
      <ProtectedRoute>
        <div className="bg-black min-h-screen text-gray-100 flex">
          <SuperAdminSidebar className="hidden md:flex flex-shrink-0" />
          <SuperAdminMobileHeader pageTitle="Settings" />
          
          <main className="flex-1 overflow-hidden flex flex-col">
            <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
              <div className="bg-gray-800 rounded-lg p-6">
                <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
                <p className="text-gray-400">Super Admin settings page</p>
              </div>
            </main>
          </main>
        </div>
      </ProtectedRoute>
    </Provider>
  );
}
