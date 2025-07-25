"use client";

import { useEffect, useState } from "react";
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

const navItems = [
  { label: "My Profile", icon: <FaUser />, key: "profile" },
  { label: "My Classes", icon: <FaChalkboardTeacher />, key: "classes" },
  { label: "My Forms", icon: <FaWpforms />, key: "forms" },
  { label: "Payments", icon: <FaCreditCard />, key: "payments" },
  { label: "Password", icon: <FaLock />, key: "password" },
];

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [progress, setProgress] = useState(83);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen flex bg-[#000000] text-white font-sans">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#00000] p-6 hidden md:block border-r border-blue-900/40">
          {/* <h2 className="text-xl font-bold mb-6 text-blue-400">Dashboard</h2> */}
          <nav className="space-y-4">
            {navItems.map(({ label, icon, key }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === key
                    ? "bg-blue-900/40 text-blue-400 font-semibold"
                    : "text-gray-400 hover:bg-blue-900/20 hover:text-white"
                }`}
              >
                <span className="text-lg">{icon}</span>
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
          {/* Welcome Header */}
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
            <StatBox color="bg-gradient-to-tr from-blue-800 to-blue-600" title="83%" subtitle="Profile Filled" />
            <StatBox color="bg-gradient-to-tr from-purple-800 to-purple-600" title="12" subtitle="Classes Enrolled" />
            <StatBox color="bg-gradient-to-tr from-pink-800 to-pink-600" title="4" subtitle="Forms Submitted" />
            <StatBox color="bg-gradient-to-tr from-yellow-700 to-yellow-500" title="3" subtitle="Pending Payments" />
          </div>

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
                      <a
                        href="https://linkedin.com/in/ronald"
                        className="text-blue-400 underline"
                      >
                        linkedin.com/in/ronald
                      </a>
                    ),
                  },
                  {
                    label: "Portfolio",
                    value: (
                      <a
                        href="https://ronaldportfolio.com"
                        className="text-blue-400 underline"
                      >
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
    <div className={`rounded-xl p-4 shadow-md ${color} text-white`}>
      <p className="text-2xl font-bold">{title}</p>
      <p className="text-sm text-blue-100">{subtitle}</p>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div
      className="bg-[#121c2e] border border-blue-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm"
      data-aos="fade-up"
    >
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
          <strong className="text-gray-400">{item.label}:</strong>{" "}
          {item.value}
        </p>
      ))}
    </div>
  );
}
