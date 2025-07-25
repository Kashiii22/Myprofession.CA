"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState, useEffect, useRef } from "react";

const profileOptions = [
  { label: "Expert Profile", href: "/expert-profile" },
  { label: "User Profile", href: "/user-profile" },
];

const categories = [
  "Income Tax",
  "GST",
  "Accounting",
  "Audit",
  "Investment",
  "Exam Oriented",
];

const dropdownOptions = [
  "Mentorship",
  "Files and Documents",
  "Articles",
  "Courses",
  "Queries",
];

export default function Header() {
  const pathname = usePathname();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="backdrop-blur-lg bg-black/80 text-white font-sans shadow-2xl rounded-b-2xl   z-[50] relative">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide text-white"
        >
          MyProfession.CA
        </Link>

        {/* Nav Links */}
        <nav className="flex gap-6 items-center text-sm">
          {[
            { label: "Home", path: "/" },
            { label: "About Us", path: "/about" },
            { label: "Privacy Policy", path: "/privacy" },
            { label: "Contact Us", path: "/contact" },
          ].map(({ label, path }, index) => (
            <Link
              key={index}
              href={path}
              className={` transition duration-200 ${
                pathname === path 
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 hover:text-blue-400 transition duration-200"
            >
              <FaUserCircle size={20} />
              <IoMdArrowDropdown />
            </button>
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-gray-900/90 backdrop-blur-md shadow-xl border border-gray-700 rounded-xl z-[999]">
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
            )}
          </div>
        </nav>
      </div>

      {/* Subheader only on landing page */}
      {pathname === "/" && (
        <div className="px-4 md:px-10 py-3 border-t border-b border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-black">
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((category, i) => (
              <div key={i} className="relative group">
                <button className="text-sm font-medium flex items-center gap-1 hover:text-blue-400 transition">
                  {category}
                  <IoMdArrowDropdown size={16} />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-50">
                  {dropdownOptions.map((item, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="block px-4 py-2 text-sm hover:bg-gray-800 text-white transition rounded-lg"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
