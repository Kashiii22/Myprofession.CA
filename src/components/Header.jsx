"use client";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const profileOptions = [
  { label: "Expert Profile", href: "/expert-profile" },
  { label: "User Profile", href: "/user-profile" },
];

export default function Header() {
  return (
    <header className="backdrop-blur-lg bg-black/80 text-white font-sans shadow-lg rounded-b-2xl mx-4 mt-4 z-[50] relative">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-white">
          MyProfession.<span className="text-blue-500">CA</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex gap-6 items-center text-sm">
          {["about", "privacy", "contact"].map((page, index) => (
            <Link
              key={index}
              href={`/${page}`}
              className="hover:text-blue-400 transition duration-200"
            >
              {page
                .replace("privacy", "Privacy Policy")
                .replace("about", "About Us")
                .replace("contact", "Contact Us")}
            </Link>
          ))}

          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-blue-400 transition duration-200">
              <FaUserCircle size={20} />
              <IoMdArrowDropdown />
            </button>
            <div className="absolute right-0 mt-3 w-44 bg-gray-900/90 backdrop-blur-md shadow-xl border border-gray-700 rounded-xl z-[999] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300">
              {profileOptions.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="block px-4 py-2 text-sm hover:bg-gray-800 transition duration-200 rounded-lg"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
