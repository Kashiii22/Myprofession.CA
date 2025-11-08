'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

import SuperAdminSidebar from '@/components/SuperAdminSidebar';
import SuperAdminMobileHeader from '@/components/SuperAdminMobileHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import MentorRequestList from '@/components/MentorRequestList';
import DashboardHeader from '@/components/DashboardHeader';
import { FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';

export default function SuperAdminRequestsPage() {
  return (
    <Provider store={store}>
      <ProtectedRoute>
        <div className="bg-black min-h-screen text-gray-100 flex">
        <SuperAdminSidebar />

        <main className="flex-1 overflow-hidden flex flex-col">
          <SuperAdminMobileHeader pageTitle="Mentor Requests" />
          
          <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
            {/* Page Header */}
            <DashboardHeader 
              title="Mentor Requests" 
              breadcrumb={[
                { label: "Dashboard", path: "/superadmin" },
                { label: "Mentor Requests", active: true }
              ]} 
            />

            {/* Requests List */}
            <MentorRequestList />
          </div>
        </main>
      </div>
      </ProtectedRoute>
    </Provider>
  );
}
