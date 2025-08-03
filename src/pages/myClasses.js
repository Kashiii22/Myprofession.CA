'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchClasses } from '@/redux/classSlice';
import {
  FaCalendarCheck,
  FaUserTie,
  FaClock,
  FaChartLine,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';

export default function MyDashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = true;
  const { stats } = useSelector((state) => state.classes || {});

  const defaultStats = {
    nextClass: '05 Aug, 3:00 PM',
    clients: 18,
    hours: 122,
    performance: '92%',
    insights: [
      { date: 'Mon', live: 5, questions: 12 },
      { date: 'Tue', live: 8, questions: 9 },
      { date: 'Wed', live: 6, questions: 11 },
      { date: 'Thu', live: 9, questions: 14 },
      { date: 'Fri', live: 12, questions: 7 },
      { date: 'Sat', live: 4, questions: 5 },
      { date: 'Sun', live: 7, questions: 10 },
    ],
  };

  const allClasses = [
    {
      _id: '3',
      date: '2025-08-05',
      time: '03:00 PM',
      withWhom: 'John Doe',
      status: 'Pending',
    },
    {
      _id: '4',
      date: '2025-08-06',
      time: '02:00 PM',
      withWhom: 'Jane Smith',
      status: 'Pending',
    },
    {
      _id: '1',
      date: '2025-08-01',
      time: '10:00 AM',
      withWhom: 'Alice Johnson',
      status: 'Completed',
    },
    {
      _id: '2',
      date: '2025-08-02',
      time: '11:30 AM',
      withWhom: 'Michael Brown',
      status: 'Completed',
    },
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      dispatch(fetchClasses());
    }
  }, [user, dispatch]);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`flex items-center gap-4 p-4 rounded-2xl shadow-md ${color}`}>
      <Icon className="text-white text-2xl" />
      <div>
        <div className="text-gray-200 text-sm">{label}</div>
        <div className="text-white font-semibold text-lg">{value}</div>
      </div>
    </div>
  );

  return (
    <>
      <Header />

      <div className="flex flex-col md:flex-row min-h-screen bg-black">
        <div className="md:w-64 w-full">
          <Sidebar />
        </div>

        <main className="flex-1 p-4 sm:p-6 overflow-x-auto text-white">
          <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard icon={FaCalendarCheck} label="Next Class" value={stats?.nextClass || defaultStats.nextClass} color="bg-blue-700" />
            <StatCard icon={FaUserTie} label="Clients" value={stats?.clients || defaultStats.clients} color="bg-purple-700" />
            <StatCard icon={FaClock} label="Hours Taught" value={stats?.hours || defaultStats.hours} color="bg-green-700" />
            <StatCard icon={FaChartLine} label="Performance" value={stats?.performance || defaultStats.performance} color="bg-yellow-600" />
          </div>

          {/* Engagement Chart */}
          <motion.div
            className="my-10 bg-[#1f2937] p-4 sm:p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-xl font-semibold mb-4">Engagement Insights</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.insights || defaultStats.insights}>
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} labelStyle={{ color: '#fff' }} />
                <Line type="monotone" dataKey="live" stroke="#FBBF24" strokeWidth={2} />
                <Line type="monotone" dataKey="questions" stroke="#60A5FA" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Unified Class Table */}
          <motion.div
            className="overflow-x-auto bg-[#1f2937] p-4 sm:p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-xl font-semibold mb-4">All Classes</h2>
            <table className="min-w-full text-left border border-gray-700 text-sm">
              <thead className="bg-[#374151] text-gray-300">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">With</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {allClasses
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((cls, index) => (
                    <tr
                      key={cls._id}
                      className={`border-t border-gray-700 ${
                        index % 2 === 0 ? 'bg-[#1e293b]' : 'bg-[#111827]'
                      } hover:bg-[#2d3748] transition`}
                    >
                      <td className="p-3">{new Date(cls.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                      <td className="p-3">{cls.time}</td>
                      <td className="p-3 font-medium">{cls.withWhom}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-semibold ${
                            cls.status === 'Pending'
                              ? 'bg-red-500 text-white'
                              : 'bg-green-500 text-white'
                          }`}
                        >
                          {cls.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {cls.status === 'Completed' ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded- transition">
                            Join
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </motion.div>
        </main>
      </div>

      <Footer />
    </>
  );
}
