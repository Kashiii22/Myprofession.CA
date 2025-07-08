"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBook,
  FaBriefcase,
  FaUserTie,
  FaFileInvoiceDollar,
  FaUserCircle,
  FaSignOutAlt,
  FaBrain,
} from "react-icons/fa";

const sidebarLinks = [
  { label: "My Bookings", href: "/dashboard", icon: <FaBook size={16} /> },
//   { label: "My Bookings", href: "/my-bookings", icon: <FaBriefcase size={16} /> },
  { label: "My Learnings", href: "/tax-returns", icon: <FaBrain size={16} /> },
  { label: "My Profile", href: "/user-profile", icon: <FaUserCircle size={16} /> },
  // { label: "Find CA Mentors", href: "/mentors", icon: <FaUserTie size={16} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-gradient-to-b from-[#0d1117]/90 to-[#0a0f1c]/90 text-white w-72 rounded-3xl shadow-[0_0_40px_rgba(0,0,100,0.2)] border border-blue-900 p-6 mt-8 ml-4 h-fit max-h-screen sticky top-6 hidden md:block">
      <nav className="space-y-2">
        {sidebarLinks.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition duration-200 ${
              pathname === link.href
                ? "bg-gradient-to-r from-blue-700/40 to-blue-900/40 text-blue-300 border border-blue-800 shadow-inner"
                : "text-gray-400 hover:bg-blue-800/30 hover:text-blue-300"
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}

       
      </nav>
    </aside>
  );
}
