'use client';

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import SuperAdminSidebar from '@/components/SuperAdminSidebar';
import SuperAdminMobileHeader from '@/components/SuperAdminMobileHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
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
import { 
  FaChartPie, 
  FaUserShield, 
  FaUsers, 
  FaDollarSign, 
  FaChalkboardTeacher,
  FaEye 
} from 'react-icons/fa';

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

export default function SuperAdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('monthly');

  // Mock data for various charts
  const revenueData = {
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

  const userActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { 
        label: 'Active Users', 
        data: [320, 480, 420, 580, 610, 450, 340], 
        borderColor: '#3b82f6', 
        backgroundColor: '#3b82f6', 
        fill: false, 
        tension: 0.3 
      },
      { 
        label: 'Sessions Booked', 
        data: [12, 18, 15, 22, 25, 18, 14], 
        borderColor: '#facc15', 
        backgroundColor: '#facc15', 
        fill: false, 
        tension: 0.3 
      }
    ]
  };

  const mentorCategoryData = {
    labels: ['Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Health'],
    datasets: [{
      data: [30, 25, 15, 12, 10, 8],
      backgroundColor: [
        '#3b82f6', '#22c55e', '#facc15', '#ef4444', '#8b5cf6', '#ec4899'
      ],
    }]
  };

  const satisfactionData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [{
      data: [65, 20, 10, 3, 2],
      backgroundColor: ['#22c55e', '#84cc16', '#facc15', '#fb923c', '#ef4444'],
    }]
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

  const analyticsCards = [
    {
      title: 'Total Revenue',
      value: '$125,600',
      change: '+15.3%',
      icon: FaDollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Active Users',
      value: '8,432',
      change: '+8.2%',
      icon: FaUsers,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Total Sessions',
      value: '2,847',
      change: '+12.5%',
      icon: FaChalkboardTeacher,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      change: '+0.3',
      icon: FaChartPie,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

  return (
    <Provider store={store}>
      <ProtectedRoute>
        <div className="bg-black min-h-screen text-gray-100 flex">
        <SuperAdminSidebar />

        <main className="flex-1 overflow-hidden flex flex-col">
          <SuperAdminMobileHeader pageTitle="Analytics Dashboard" />
          
          <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaChartPie className="text-blue-400 text-2xl" />
              <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Last Week</option>
                <option value="monthly">Last Month</option>
                <option value="quarterly">Last Quarter</option>
                <option value="yearly">Last Year</option>
              </select>
              <div className="flex items-center gap-2 text-blue-400">
                <FaUserShield className="text-xl" />
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {analyticsCards.map((card, index) => (
              <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.bgColor} p-3 rounded-lg`}>
                    <card.icon className={`${card.color} text-xl`} />
                  </div>
                  <span className={`text-sm font-medium ${card.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {card.change}
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue & Expenses</h3>
              <div className="h-64">
                <Bar data={revenueData} options={chartOptions} />
              </div>
            </div>

            {/* User Activity Chart */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Weekly User Activity</h3>
              <div className="h-64">
                <Line data={userActivityData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Mentor Categories */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Mentor Categories</h3>
              <div className="h-48">
                <Pie data={mentorCategoryData} options={pieChartOptions} />
              </div>
            </div>

            {/* User Satisfaction */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">User Satisfaction</h3>
              <div className="h-48">
                <Pie data={satisfactionData} options={pieChartOptions} />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Conversion Rate</span>
                  <span className="text-white font-medium">24.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg. Session Duration</span>
                  <span className="text-white font-medium">52 mins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Mentors</span>
                  <span className="text-white font-medium">186</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pending Requests</span>
                  <span className="text-white font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Refund Rate</span>
                  <span className="text-white font-medium">2.1%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Stats Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400">Period</th>
                    <th className="text-left p-3 text-gray-400">Revenue</th>
                    <th className="text-left p-3 text-gray-400">Users</th>
                    <th className="text-left p-3 text-gray-400">Sessions</th>
                    <th className="text-left p-3 text-gray-400">Growth</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="p-3">June 2024</td>
                    <td className="p-3">$22,000</td>
                    <td className="p-3">1,247</td>
                    <td className="p-3">285</td>
                    <td className="p-3 text-green-400">+15%</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="p-3">May 2024</td>
                    <td className="p-3">$20,000</td>
                    <td className="p-3">1,187</td>
                    <td className="p-3">267</td>
                    <td className="p-3 text-green-400">+12%</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="p-3">April 2024</td>
                    <td className="p-3">$18,000</td>
                    <td className="p-3">1,056</td>
                    <td className="p-3">242</td>
                    <td className="p-3 text-green-400">+8%</td>
                  </tr>
                  <tr className="hover:bg-gray-700 transition-colors">
                    <td className="p-3">March 2024</td>
                    <td className="p-3">$11,000</td>
                    <td className="p-3">892</td>
                    <td className="p-3">218</td>
                    <td className="p-3 text-red-400">-5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </main>
      </div>
      </ProtectedRoute>
    </Provider>
  );
}
