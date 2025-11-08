'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

import SuperAdminSidebar from '@/components/SuperAdminSidebar';
import SuperAdminMobileHeader from '@/components/SuperAdminMobileHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import SuperAdminBranding from '@/components/SuperAdminBranding';
import DashboardHeader from '@/components/DashboardHeader';
import KpiCards from '@/components/KpiCards';
import MentorRequestList from '@/components/MentorRequestList';
import { 
  Bar, 
  Line, 
  Pie, 
  Cell 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { FaUserShield, FaChalkboardTeacher, FaUsers, FaDollarSign, FaClock, FaCheckCircle, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalMentors: 0,
    activeMentors: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    pendingRequests: 0,
    totalSessions: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const revenueExpenseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { 
        label: 'Revenue', 
        data: [12000, 15000, 11000, 18000, 20000, 22000], 
        backgroundColor: '#22c55e', 
        borderRadius: 6 
      },
      { 
        label: 'Expenses', 
        data: [8000, 9000, 7000, 10000, 11000, 12000], 
        backgroundColor: '#ef4444', 
        borderRadius: 6 
      }
    ]
  };

  const mentorStatusData = {
    labels: ['Active', 'Pending', 'Verified', 'Suspended'],
    datasets: [{
      data: [45, 12, 8, 3],
      backgroundColor: ['#22c55e', '#facc15', '#3b82f6', '#ef4444'],
    }]
  };

  const userGrowthData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      { 
        label: 'New Users', 
        data: [120, 180, 150, 220], 
        borderColor: '#facc15', 
        backgroundColor: '#facc15', 
        fill: false, 
        tension: 0.3 
      },
      { 
        label: 'Active Sessions', 
        data: [80, 120, 100, 160], 
        borderColor: '#22c55e', 
        backgroundColor: '#22c55e', 
        fill: false, 
        tension: 0.3 
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        labels: { color: '#fff' } 
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#333',
        borderWidth: 1,
      }
    },
    scales: {
      x: { ticks: { color: '#fff' }, grid: { color: '#444' } },
      y: { ticks: { color: '#fff' }, grid: { color: '#444' } }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#fff' }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#333',
        borderWidth: 1,
      }
    }
  };

  const recentActivities = [
    { id: 1, type: 'mentor_request', message: 'John Doe applied to become a mentor', time: '2 hours ago', status: 'pending' },
    { id: 2, type: 'user_registered', message: 'New user Sarah Smith registered', time: '3 hours ago', status: 'success' },
    { id: 3, type: 'payment_received', message: 'Payment received: $150 from session booking', time: '5 hours ago', status: 'success' },
    { id: 4, type: 'mentor_approved', message: 'Mike Johnson approved as mentor', time: '1 day ago', status: 'success' },
    { id: 5, type: 'system_alert', message: 'Server maintenance scheduled', time: '2 days ago', status: 'warning' },
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'mentor_request': return <FaChalkboardTeacher className="text-yellow-400" />;
      case 'user_registered': return <FaUsers className="text-green-400" />;
      case 'payment_received': return <FaDollarSign className="text-blue-400" />;
      case 'mentor_approved': return <FaCheckCircle className="text-green-400" />;
      case 'system_alert': return <FaExclamationTriangle className="text-orange-400" />;
      default: return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500 text-black',
      success: 'bg-green-600 text-white',
      warning: 'bg-orange-600 text-white',
      error: 'bg-red-600 text-white',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Provider store={store}>
      <ProtectedRoute>
        <div className="bg-black min-h-screen text-gray-100">
          <SuperAdminSidebar className="hidden md:flex fixed left-0 top-0 h-full" />

          <main className="md:ml-64 overflow-hidden flex flex-col">
            <SuperAdminMobileHeader pageTitle="SuperAdmin Dashboard" />

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
          
            {/* Branded Header */}
            <SuperAdminBranding />
            
            {/* Dashboard Header */}
            <DashboardHeader 
              title="SuperAdmin Dashboard" 
              breadcrumb={[
                { label: "Dashboard", active: true }
              ]} 
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-4 rounded-lg border border-blue-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-gray-300 text-xs uppercase tracking-wider font-medium">Total Mentors</h3>
                    <p className="text-blue-400 text-xs mt-1">Expert Professionals</p>
                  </div>
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <FaChalkboardTeacher className="text-blue-400 text-lg" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">68</div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <span className="text-green-400 text-xs">+12%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-4 rounded-lg border border-green-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-gray-300 text-xs uppercase tracking-wider font-medium">Active Users</h3>
                    <p className="text-green-400 text-xs mt-1">Platform Engagement</p>
                  </div>
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <FaUsers className="text-green-400 text-lg" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">1,247</div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '82%'}}></div>
                  </div>
                  <span className="text-green-400 text-xs">+8%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/50 to-orange-800/50 p-4 rounded-lg border border-yellow-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-gray-300 text-xs uppercase tracking-wider font-medium">Monthly Revenue</h3>
                    <p className="text-yellow-400 text-xs mt-1">Platform Income</p>
                  </div>
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <FaDollarSign className="text-yellow-400 text-lg" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">$22,000</div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <span className="text-green-400 text-xs">+15%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-900/50 to-pink-800/50 p-4 rounded-lg border border-red-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-gray-300 text-xs uppercase tracking-wider font-medium">Pending</h3>
                    <p className="text-red-400 text-xs mt-1">Action Required</p>
                  </div>
                  <div className="bg-red-500/20 p-2 rounded-lg">
                    <FaExclamationTriangle className="text-red-400 text-lg" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">12</div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-red-400 h-2 rounded-full animate-pulse" style={{width: '45%'}}></div>
                  </div>
                  <span className="text-red-400 text-xs">Urgent</span>
                </div>
              </div>
            </div>

            {/* Analytics Overview */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <FaChartLine className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Platform Analytics</h3>
                    <p className="text-gray-400 text-sm">Real-time performance metrics</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">Last updated</span>
                  <div className="text-white text-sm">Live Data</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <h4 className="text-white font-medium">Revenue vs Expenses</h4>
                  </div>
                  <p className="text-gray-400 text-xs mb-4">Monthly financial performance comparison</p>
                  <div className="h-64">
                    <Bar data={revenueExpenseData} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <h4 className="text-white font-medium">User Growth</h4>
                  </div>
                  <p className="text-gray-400 text-xs mb-4">Weekly user acquisition and engagement</p>
                  <div className="h-64">
                    <Line data={userGrowthData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Second Row Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <h4 className="text-white font-medium">Mentor Distribution</h4>
                  </div>
                  <p className="text-gray-400 text-xs mb-4">Status breakdown across all mentors</p>
                  <div className="h-48">
                    <Pie data={mentorStatusData} options={pieChartOptions} />
                  </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600 lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <h4 className="text-white font-medium">Platform Activity</h4>
                  </div>
                  <p className="text-gray-400 text-xs mb-4">Recent system events and updates</p>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {getActivityIcon(activity.type)}
                          <div>
                            <p className="text-white text-sm font-medium">{activity.message}</p>
                            <p className="text-gray-400 text-xs">{activity.time}</p>
                          </div>
                        </div>
                        {getStatusBadge(activity.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor Requests Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500/20 p-3 rounded-lg">
                    <FaChalkboardTeacher className="text-orange-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Mentor Application Queue</h3>
                    <p className="text-gray-400 text-sm">Pending mentor registrations and approvals</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    View All Requests →
                  </button>
                  <span className="bg-orange-500/20 px-2 py-1 rounded-full text-xs text-orange-400 font-medium">
                    {stats.pendingRequests} pending
                  </span>
                </div>
              </div>
              <MentorRequestList limit={5} />
            </div>
          </div>
          </main>
        </div>
      </ProtectedRoute>
    </Provider>
  );
}
