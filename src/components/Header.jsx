"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import AuthModal from "@/components/AuthModal";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Contact Us", path: "/contact" },
];

const PROFILE_OPTIONS = [
  { label: "Expert Profile", href: "/register" },
  { label: "User Profile", href: "/login" }, // this will trigger modal instead of redirect
];

const CATEGORIES = [
  "Income Tax",
  "GST",
  "Accounting",
  "Audit",
  "Investment",
  "Exam Oriented",
];

const DROPDOWN_OPTIONS = [
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
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const categoryRefs = useRef([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openCategoryIndex !== null &&
        categoryRefs.current[openCategoryIndex] &&
        !categoryRefs.current[openCategoryIndex].contains(e.target)
      ) {
        setOpenCategoryIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openCategoryIndex]);

  return (
    <>
      <header className="backdrop-blur-lg bg-black/80 text-white font-sans shadow-2xl rounded-b-2xl z-50 relative">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
          <Link href="/" className="text-3xl font-extrabold tracking-wide text-white">
            MyProfession.CA
          </Link>

          <nav className="flex gap-6 items-center text-lg">
            {NAV_LINKS.map(({ label, path }, i) => (
              <Link
                key={i}
                href={path}
                className={`transition duration-200 ${
                  label === "Home"
                    ? "text-gray-300 "
                    : pathname === path
                    ? "text-blue-400 font-semibold"
                    : "text-gray-300 hover:text-blue-400"
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
                <div className="absolute right-0 mt-3 w-44 bg-gray-900/90 backdrop-blur-md shadow-xl border border-gray-700 rounded-xl z-50">
                  {PROFILE_OPTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (item.label === "User Profile") {
                          setShowLoginModal(true);
                        } else {
                          window.location.href = item.href;
                        }
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition duration-200 rounded-lg"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Subheader - Only on Home Page */}
        {(
          <div className="px-4 md:px-10 py-3 border-t border-b border-gray-700 bg-gradient-to-r from-gray-950 via-gray-900 to-black">
            <div className="flex flex-wrap justify-center gap-6">
              {CATEGORIES.map((category, i) => (
                <div
                  key={i}
                  className="relative"
                  ref={(el) => (categoryRefs.current[i] = el)}
                >
                  <button
                    onClick={() =>
                      setOpenCategoryIndex(openCategoryIndex === i ? null : i)
                    }
                    className="text-xl text-gray-300 flex items-center gap-1 hover:text-blue-400 transition"
                  >
                    {category}
                    <IoMdArrowDropdown size={20} />
                  </button>

                  {openCategoryIndex === i && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-gray-800/95 backdrop-blur-md border border-gray-600 rounded-xl shadow-xl z-50 text-xl">
                      {DROPDOWN_OPTIONS.map((item, idx) => (
                        <Link
                          key={idx}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition rounded-lg"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {showLoginModal && <AuthModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
