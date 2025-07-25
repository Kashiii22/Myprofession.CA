"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBook,
  FaBrain,
  FaUserCircle,
} from "react-icons/fa";

const sidebarLinks = [
  { label: "My Bookings", href: "/dashboard", icon: <FaBook size={16} /> },
  { label: "My Learnings", href: "/tax-returns", icon: <FaBrain size={16} /> },
  { label: "My Profile", href: "/user-profile", icon: <FaUserCircle size={16} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-black text-white w-72 rounded-3xl shadow-[0_0_40px_rgba(0,0,100,0.2)] border border-blue-900 p-6 mt-8 ml-4 h-fit max-h-screen sticky top-6 hidden md:block">
      <h2 className="text-xl font-bold text-blue-400 mb-6 tracking-wide">Dashboard</h2>
      <nav className="space-y-3">
        {sidebarLinks.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition duration-200 ${
              pathname === link.href
                ? "bg-gradient-to-r from-blue-700/40 to-blue-900/40 text-blue-300 border border-blue-800 shadow-inner"
                : "text-gray-400 hover:bg-blue-800/30 hover:text-blue-300"
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
