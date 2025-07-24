"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaUser,
  FaChalkboardTeacher,
  FaWpforms,
  FaCreditCard,
  FaLock,
} from "react-icons/fa";
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800 });
    let percent = 0;
    const interval = setInterval(() => {
      if (percent < 80) {
        percent += 1;
        setProgress(percent);
      } else {
        clearInterval(interval);
      }
    }, 20);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white flex">
        {/* Sidebar */}
        <aside className="w-64 bg-black/80 backdrop-blur-md border-r border-gray-800 rounded-tr-3xl rounded-br-3xl shadow-2xl hidden md:block p-6">
          <nav className="space-y-3">
            {navItems.map(({ label, icon, key }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left transition duration-300 group ${
                  activeTab === key
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className={`text-lg ${
                    activeTab === key
                      ? "text-white"
                      : "text-blue-400 group-hover:text-white"
                  }`}
                >
                  {icon}
                </span>
                <span className="font-medium">{label}</span>
              </button>
            ))}
            <button className="w-full text-left text-red-500 hover:text-red-300 mt-10 px-4 py-2">
              Delete Account
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4" data-aos="fade-right">
              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="w-20 h-20 rounded-full border-4 border-blue-600"
              />
              <div>
                <h2 className="text-2xl font-semibold">Ronald Richards</h2>
                <p className="text-sm text-gray-400">
                  ronaldrich@example.com
                </p>
              </div>
            </div>

            {/* Progress Circle */}
            <div
              className="relative w-28 h-28 rounded-full bg-[#111827] border-4 border-blue-700 flex items-center justify-center text-center"
              data-aos="fade-left"
            >
              <div className="absolute w-full h-full rounded-full bg-gray-900 z-0" />
              <svg
                className="w-full h-full rotate-[-90deg] z-10"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-gray-800"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-white font-bold text-lg">
                {progress}%
              </div>
            </div>
          </div>

          {/* Sections */}
          <section className="space-y-8">
            {/* Personal Info */}
            <div
              className="bg-[#1f2937] p-6 rounded-xl border border-gray-700"
              data-aos="fade-up"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <button className="text-sm text-blue-400 hover:text-white">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <p>
                  <strong>Full Name:</strong> Ronald Richards
                </p>
                <p>
                  <strong>Date of Birth:</strong> 1990-07-10
                </p>
                <p>
                  <strong>Gender:</strong> Male
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div
              className="bg-[#1f2937] p-6 rounded-xl border border-gray-700"
              data-aos="fade-up"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <button className="text-sm text-blue-400 hover:text-white">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <p>
                  <strong>Email:</strong> ronaldrich@example.com
                </p>
                <p>
                  <strong>Phone:</strong> (219) 555-0114
                </p>
              </div>
            </div>

            {/* Professional Info */}
            <div
              className="bg-[#1f2937] p-6 rounded-xl border border-gray-700"
              data-aos="fade-up"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Professional Info</h3>
                <button className="text-sm text-blue-400 hover:text-white">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <p>
                  <strong>Qualification:</strong> Chartered Accountant
                </p>
                <p>
                  <strong>Stage of CA:</strong> Final Cleared
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div
              className="bg-[#1f2937] p-6 rounded-xl border border-gray-700"
              data-aos="fade-up"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Social Links</h3>
                <button className="text-sm text-blue-400 hover:text-white">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <p>
                  <strong>Portfolio:</strong>{" "}
                  <a
                    href="https://ronaldportfolio.com"
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ronaldportfolio.com
                  </a>
                </p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href="https://linkedin.com/in/ronald"
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    linkedin.com/in/ronald
                  </a>
                </p>
              </div>
            </div>

            {/* Location */}
            <div
              className="bg-[#1f2937] p-6 rounded-xl border border-gray-700"
              data-aos="fade-up"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Location</h3>
                <button className="text-sm text-blue-400 hover:text-white">
                  Edit
                </button>
              </div>
              <input
                type="text"
                defaultValue="California"
                className="w-full px-4 py-2 rounded bg-[#111827] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
              />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
