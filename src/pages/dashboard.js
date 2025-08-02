"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import {
  FaUser,
  FaChalkboardTeacher,
  FaWpforms,
  FaLock,
  FaTachometerAlt,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "@/components/Header";

// Navigation items for sidebar
const navItems = [
  { label: "Dashboard", icon: FaTachometerAlt, path: "/dashboard" },
  { label: "My Profile", icon: FaUser, path: "/myProfile" },
  { label: "My Classes", icon: FaChalkboardTeacher, path: "/classes" },
  { label: "Availability", icon: FaLock, path: "/availability" },
  { label: "My Forms", icon: FaWpforms, path: "/forms" },
];

export default function MyProfile() {
  const router = useRouter();
  const pathname = usePathname();

  const stats = useSelector((state) => state.dashboard.stats);
  const meetings = useSelector((state) => state.dashboard.meetings);
  const user = useSelector((state) => state.profile.personalDetails);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col md:flex-row bg-black text-white font-sans">
        {/* Sidebar */}
        <aside className="w-full md:w-64 p-4 md:p-6 border-b md:border-b-0 md:border-r border-blue-900/40">
          <nav className="flex md:flex-col gap-2 md:gap-4 justify-around md:justify-start">
            {navItems.map(({ label, icon: Icon, path }) => {
              const isActive = pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => router.push(path)}
                  className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-900/40 text-blue-400 font-semibold"
                      : "text-gray-400 hover:bg-blue-900/20 hover:text-white"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-900/30 border border-blue-800 rounded-2xl px-6 py-6 shadow-md">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-blue-300">
                Hi, {user?.firstName || "User"}!
              </h1>
              <p className="text-gray-400">
                Welcome back to your dashboard 👋
              </p>
            </div>
            <img
              src="https://www.svgrepo.com/show/375669/avatar-profile.svg"
              alt="Welcome"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-l">
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

          {/* Upcoming Meetings */}
          <div
            className="bg-[#121c2e] border border-blue-800/50 rounded-xl p-6 shadow-lg"
            data-aos="fade-up"
          >
            <h3 className="text-sm font-semibold text-blue-200 mb-4">
              Upcoming Meetings
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-300">
                <thead className="bg-blue-800 text-blue-100">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">With</th>
                    <th className="px-4 py-2">Topic</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(meetings || []).map((meet, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 0 ? "bg-blue-900/30" : "bg-blue-900/20"
                      } hover:bg-blue-900/40 transition-colors duration-200`}
                    >
                      <td className="px-4 py-2">{meet.date}</td>
                      <td className="px-4 py-2">{meet.time}</td>
                      <td className="px-4 py-2">{meet.with}</td>
                      <td className="px-4 py-2">{meet.topic}</td>
                      <td className="px-4 py-2">
                        <a
                          href={meet.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 rounded-lg text-white hover:opacity-90 transition"
                        >
                          Join
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// ✅ StatBox component
function StatBox({ title, subtitle, color, isCurrency = false }) {
  const value = typeof title === "number" ? title : parseFloat(title);

  return (
    <div
      className={`rounded-xl p-4 shadow-md bg-gradient-to-tr ${color} text-white transition hover:scale-105 duration-300`}
    >
      <p className="text-2xl font-bold tracking-tight">
        {isCurrency
          ? `₹${value.toLocaleString("en-IN")}`
          : value?.toLocaleString("en-IN")}
      </p>
      <p className="text-sm text-blue-100">{subtitle}</p>
    </div>
  );
}
