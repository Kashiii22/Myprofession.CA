"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaWpforms,
  FaCreditCard,
  FaLock,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "@/components/Header";
import dynamic from "next/dynamic";

// Chart.js setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

const navItems = [
  { label: "My Profile", icon: FaUser, key: "profile" },
  { label: "My Classes", icon: FaChalkboardTeacher, key: "classes" },
  { label: "My Forms", icon: FaWpforms, key: "forms" },
  { label: "Payments", icon: FaCreditCard, key: "payments" },
  { label: "Password", icon: FaLock, key: "password" },
];

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const profileBarData = useMemo(() => ({
    labels: ["Filled", "Remaining"],
    datasets: [
      {
        label: "Completion",
        data: [83, 17],
        backgroundColor: ["#3b82f6", "#1e293b"],
        borderRadius: 6,
      },
    ],
  }), []);

  const classesLineData = useMemo(() => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Classes Enrolled",
        data: [3, 5, 8, 10, 12],
        fill: false,
        borderColor: "#8b5cf6",
        tension: 0.3,
      },
    ],
  }), []);

  const formsBarData = useMemo(() => ({
    labels: ["Form A", "Form B", "Form C", "Form D"],
    datasets: [
      {
        label: "Forms",
        data: [1, 1, 1, 1],
        backgroundColor: "#ec4899",
        borderRadius: 5,
      },
    ],
  }), []);

  const paymentsLineData = useMemo(() => ({
    labels: ["Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Pending Payments",
        data: [1, 2, 3],
        fill: false,
        borderColor: "#facc15",
        tension: 0.4,
      },
    ],
  }), []);

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#cbd5e1" } },
    },
    scales: {
      x: { ticks: { color: "#cbd5e1" }, grid: { color: "#1e293b" } },
      y: { ticks: { color: "#cbd5e1" }, grid: { color: "#1e293b" } },
    },
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex bg-black text-white font-sans">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen p-6 hidden md:block border-r border-blue-900/40">
          <nav className="space-y-4">
            {navItems.map(({ label, icon: Icon, key }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === key
                    ? "bg-blue-900/40 text-blue-400 font-semibold"
                    : "text-gray-400 hover:bg-blue-900/20 hover:text-white"
                }`}
              >
                <Icon className="text-lg" />
                <span>{label}</span>
              </button>
            ))}
            <button className="mt-10 text-red-500 hover:text-red-600 text-sm">
              Delete Account
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 space-y-8">
          {/* Welcome Banner */}
          <div className="flex items-center justify-between bg-blue-900/30 border border-blue-800 rounded-2xl px-6 py-6 shadow-md">
            <div>
              <h1 className="text-2xl font-bold text-blue-300">Hi, Ronald!</h1>
              <p className="text-gray-400">Welcome back to your dashboard 👋</p>
            </div>
            <img
              src="https://www.svgrepo.com/show/375669/avatar-profile.svg"
              alt="Welcome"
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox title="83%" subtitle="Profile Filled" color="from-blue-800 to-blue-600" />
            <StatBox title="12" subtitle="Classes Enrolled" color="from-purple-800 to-purple-600" />
            <StatBox title="4" subtitle="Forms Submitted" color="from-pink-800 to-pink-600" />
            <StatBox title="3" subtitle="Pending Payments" color="from-yellow-700 to-yellow-500" />
          </div>

          {/* Simplified Charts: 2 per row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ChartCard title="Profile Completion">
              <Bar data={profileBarData} options={commonOptions} />
            </ChartCard>

            <ChartCard title="Class Enrollments">
              <Line data={classesLineData} options={commonOptions} />
            </ChartCard>

            <ChartCard title="Forms Activity">
              <Bar data={formsBarData} options={commonOptions} />
            </ChartCard>

            <ChartCard title="Pending Payments Over Time">
              <Line data={paymentsLineData} options={commonOptions} />
            </ChartCard>
          </div>

          {/* Info Sections */}
          <section className="space-y-6">
            <InfoCard title="Personal Info">
              <InfoGrid
                data={[
                  { label: "Name", value: "Ronald Richards" },
                  { label: "DOB", value: "1990-07-10" },
                  { label: "Gender", value: "Male" },
                ]}
              />
            </InfoCard>

            <InfoCard title="Contact Info">
              <InfoGrid
                data={[
                  { label: "Email", value: "ronaldrich@example.com" },
                  { label: "Phone", value: "+1 (219) 555-0114" },
                ]}
              />
            </InfoCard>

            <InfoCard title="CA Details">
              <InfoGrid
                data={[
                  { label: "Stage", value: "Final Cleared" },
                  { label: "Qualification", value: "Chartered Accountant" },
                ]}
              />
            </InfoCard>

            <InfoCard title="Socials">
              <InfoGrid
                data={[
                  {
                    label: "LinkedIn",
                    value: (
                      <a href="https://linkedin.com/in/ronald" className="text-blue-400 underline">
                        linkedin.com/in/ronald
                      </a>
                    ),
                  },
                  {
                    label: "Portfolio",
                    value: (
                      <a href="https://ronaldportfolio.com" className="text-blue-400 underline">
                        ronaldportfolio.com
                      </a>
                    ),
                  },
                ]}
              />
            </InfoCard>
          </section>
        </main>
      </div>
    </>
  );
}

function StatBox({ title, subtitle, color }) {
  return (
    <div className={`rounded-xl p-4 shadow-md bg-gradient-to-tr ${color} text-white`}>
      <p className="text-2xl font-bold">{title}</p>
      <p className="text-sm text-blue-100">{subtitle}</p>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="bg-[#121c2e] border border-blue-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm" data-aos="fade-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-200">{title}</h3>
        <button className="text-sm text-blue-400 hover:underline">Edit</button>
      </div>
      {children}
    </div>
  );
}

function InfoGrid({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
      {data.map((item, idx) => (
        <p key={idx}>
          <strong className="text-gray-400">{item.label}:</strong> <span>{item.value}</span>
        </p>
      ))}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-[#121c2e] p-4 rounded-xl shadow-lg border border-blue-800/50" data-aos="zoom-in">
      <h4 className="text-sm font-medium text-blue-200 mb-2">{title}</h4>
      {children}
    </div>
  );
}
