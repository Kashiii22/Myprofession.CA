  'use client';
  import { Provider } from 'react-redux';
  import { store } from "../redux/store";
  import Header from '@/components/Header';
  import Sidebar from '@/components/AdminSidebar';
  import KpiCards from '@/components/KpiCards';
  import { Bar, Line } from 'react-chartjs-2';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  );

  export default function DashboardPage() {
    const revenueExpenseData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { label: 'Revenue', data: [12000, 15000, 11000, 18000, 20000, 22000], backgroundColor: '#22c55e', borderRadius: 6 },
        { label: 'Expenses', data: [8000, 9000, 7000, 10000, 11000, 12000], backgroundColor: '#ef4444', borderRadius: 6 }
      ]
    };

    const profitTrendData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { label: 'Profit', data: [4000, 6000, 4000, 8000, 9000, 10000], borderColor: '#3b82f6', backgroundColor: '#3b82f6', fill: false, tension: 0.3 }
      ]
    };

    const engagementData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        { label: 'Active Users', data: [320, 410, 380, 450], borderColor: '#facc15', backgroundColor: '#facc15', fill: false, tension: 0.3 }
      ]
    };

    const topServices = [
      { service: 'Mentorship Program', users: 120 },
      { service: 'Business Consultation', users: 95 },
      { service: 'Workshops', users: 75 }
    ];

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#fff' } } },
      scales: {
        x: { ticks: { color: '#fff' }, grid: { color: '#444' } },
        y: { ticks: { color: '#fff' }, grid: { color: '#444' } }
      }
    };

    return (
      <Provider store={store}>
        <div className="bg-black min-h-screen text-gray-100 flex flex-col">
          <Header />
          <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
            {/* Sidebar on md+ screens, collapses on smaller */}
            <Sidebar className="md:h-screen md:w-64 w-full shrink-0" />

            {/* Main content scrollable with padding */}
            <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
              <KpiCards />

              {/* Revenue & Profit Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg h-64 md:h-[300px]">
                  <Bar data={revenueExpenseData} options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { display: true, text: 'Revenue vs Expenses', color: '#fff' } }
                  }} />
                </div>
                <div className="bg-gray-800 p-4 rounded-lg h-64 md:h-[300px]">
                  <Line data={profitTrendData} options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { display: true, text: 'Monthly Profit Trend', color: '#fff' } }
                  }} />
                </div>
              </div>

              {/* User Engagement Chart */}
              <div className="bg-gray-800 p-4 rounded-lg h-64 md:h-[300px]">
                <Line data={engagementData} options={{
                  ...chartOptions,
                  plugins: { ...chartOptions.plugins, title: { display: true, text: 'User Engagement Over Time', color: '#fff' } }
                }} />
              </div>

              {/* Top Services Table */}
              <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Top Performing Services</h3>
                <table className="w-full text-left min-w-[320px]">
                  <thead>
                    <tr>
                      <th className="p-2">Service</th>
                      <th className="p-2">Active Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topServices.map((s, i) => (
                      <tr key={i} className="border-t border-gray-700">
                        <td className="p-2">{s.service}</td>
                        <td className="p-2">{s.users}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pending Approvals Summary */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
                <ul className="space-y-2">
                  <li>👤 Mentor Registration Requests - 5</li>
                  <li>📄 Content Upload Requests - 3</li>
                  <li>💼 Partnership Proposals - 2</li>
                </ul>
              </div>
            </main>
          </div>
        </div>
      </Provider>
    );
  }
