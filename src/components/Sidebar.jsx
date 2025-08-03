"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaWpforms,
  FaLock,
  FaTachometerAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", icon: FaTachometerAlt, path: "/dashboard" },
  { label: "My Profile", icon: FaUser, path: "/myProfile" },
  { label: "My Classes", icon: FaChalkboardTeacher, path: "/myClasses" },
  { label: "Availability", icon: FaLock, path: "/availability" },
  { label: "My Forms", icon: FaWpforms, path: "/forms" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-black p-4 flex justify-between items-center text-lg">
        {/* <h1 className="text-white text-xl font-bold">My Dashboard</h1> */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white bg-blue-800 rounded-full p-2 text-xl"
          aria-label="Open Menu"
        >
          <FaArrowLeft />
        </button>
      </div>

      {/* Click-to-close Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Drawer (Mobile) */}
      <div
        className={`fixed top-[128px] right-0 h-[calc(100%-128px)] w-64 bg-black border-l border-blue-900/40 z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}
      >
        <div className="flex justify-end p-4 border-b border-blue-800">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white bg-blue-800 rounded-full p-2 text-xl"
            aria-label="Close Menu"
          >
            <FaArrowRight />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-4 mt-4">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = pathname === path;
            return (
              <button
                key={path}
                onClick={() => {
                  router.push(path);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base transition-all ${
                  isActive
                    ? "bg-blue-900/40 text-blue-400 font-semibold"
                    : "text-gray-400 hover:bg-blue-900/20 hover:text-white"
                }`}
              >
                <Icon className="text-xl" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex md:flex-col w-64 bg-black border-r border-blue-900/40 p-4">
        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = pathname === path;
            return (
              <button
                key={path}
                onClick={() => router.push(path)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base transition-all ${
                  isActive
                    ? "bg-blue-900/40 text-blue-400 font-semibold"
                    : "text-gray-400 hover:bg-blue-900/20 hover:text-white"
                }`}
              >
                <Icon className="text-xl" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
