"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBook, FaBrain, FaUserCircle } from "react-icons/fa";

const sidebarLinks = [
  { label: "My Bookings", href: "/dashboard", Icon: FaBook },
  { label: "My Learnings", href: "/tax-returns", Icon: FaBrain },
  { label: "My Profile", href: "/user-profile", Icon: FaUserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-black text-white w-72 rounded-3xl shadow-[0_0_40px_rgba(0,0,100,0.2)] border border-blue-900 p-6 mt-8 ml-4 h-fit max-h-screen sticky top-6 hidden md:block">
      <h2 className="text-xl font-bold text-blue-400 mb-6 tracking-wide">Dashboard</h2>
      <nav className="space-y-3">
        {sidebarLinks.map(({ label, href, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-700/40 to-blue-900/40 text-blue-300 border border-blue-800 shadow-inner"
                  : "text-gray-400 hover:bg-blue-800/30 hover:text-blue-300"
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
