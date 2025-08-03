"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const stats = useSelector((state) => state.dashboard.stats);
  const meetings = useSelector((state) => state.dashboard.meetings);
  const user = useSelector((state) => state.profile.personalDetails);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <>
      <Header />

      <div className="relative bg-black text-white font-sans min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 w-full overflow-x-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-900/30 border border-blue-800 rounded-2xl p-4 sm:p-6 shadow-md">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-300">
                Hi, {user?.firstName || "User"}!
              </h1>
              <p className="text-base sm:text-lg text-gray-400">
                Welcome back to your dashboard 👋
              </p>
            </div>
            <img
              src="https://www.svgrepo.com/show/375669/avatar-profile.svg"
              alt="Avatar"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox
              title={stats?.earnings || 0}
              subtitle="Earnings"
              color="from-green-800 to-green-600"
              isCurrency
            />
            <StatBox
              title={stats?.settlements || 0}
              subtitle="Settlements"
              color="from-yellow-700 to-yellow-500"
              isCurrency
            />
            <StatBox
              title={stats?.students || 0}
              subtitle="Students Mentored"
              color="from-purple-800 to-purple-600"
            />
            <StatBox
              title={stats?.forms || 0}
              subtitle="Forms Submitted"
              color="from-pink-800 to-pink-600"
            />
          </div>

          {/* Responsive Table Section */}
          <div
            className="bg-[#121c2e] border border-blue-800/50 rounded-xl p-4 sm:p-6 shadow-lg"
            data-aos="fade-up"
          >
            <h3 className="text-2xl font-semibold text-blue-200 mb-5">
              Upcoming Meetings
            </h3>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl shadow">
              <table className="min-w-full bg-[#0f172a] text-gray-300 rounded-2xl overflow-hidden text-base">
                <thead className="bg-[#1e293b] text-gray-300">
                  <tr>
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-left px-6 py-3">Time</th>
                    <th className="text-left px-6 py-3">With</th>
                    <th className="text-left px-6 py-3">Topic</th>
                    <th className="text-left px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(meetings || []).map((meet, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-700 hover:bg-blue-900/30 transition"
                    >
                      <td className="px-6 py-3 whitespace-nowrap">{meet.date}</td>
                      <td className="px-6 py-3 whitespace-nowrap">{meet.time}</td>
                      <td className="px-6 py-3 font-medium whitespace-nowrap">{meet.with}</td>
                      <td className="px-6 py-3 whitespace-nowrap">{meet.topic}</td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <a
                          href={meet.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded transition"
                        >
                          Join
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Table */}
            <div className="sm:hidden space-y-4">
              {(meetings || []).map((meet, idx) => (
                <div
                  key={idx}
                  className="bg-[#0f172a] border border-gray-700 rounded-xl p-4 shadow"
                >
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Date:</span>{" "}
                    <span className="text-white">{meet.date}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Time:</span>{" "}
                    <span className="text-white">{meet.time}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">With:</span>{" "}
                    <span className="text-white font-medium">{meet.with}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Topic:</span>{" "}
                    <span className="text-white">{meet.topic}</span>
                  </div>
                  <div>
                    <a
                      href={meet.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded transition"
                    >
                      Join
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

function StatBox({ title, subtitle, color, isCurrency = false }) {
  const value = typeof title === "number" ? title : parseFloat(title);
  const display = isCurrency
    ? `₹${value.toLocaleString("en-IN")}`
    : value?.toLocaleString("en-IN");

  return (
    <div
      className={`rounded-xl p-4 shadow-md bg-gradient-to-tr ${color} text-white hover:scale-[1.03] transition-transform duration-200`}
    >
      <p className="text-xl sm:text-2xl font-bold">{display}</p>
      <p className="text-sm sm:text-base text-blue-100">{subtitle}</p>
    </div>
  );
}
