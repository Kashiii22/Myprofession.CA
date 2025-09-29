"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaUserCircle, FaBars, FaTimes, 
  FaInstagram, FaYoutube, FaEnvelope 
} from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import AuthModal from "@/components/AuthModal";

// Simulate login state
const isUserLoggedIn = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isLoggedIn") === "true";
  }
  return false;
};

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

// Categories with slugs
const CATEGORIES = [
  { name: "Income Tax", slug: "income-tax" },
  { name: "GST", slug: "gst" },
  { name: "Accounting", slug: "accounting" },
  { name: "Audit", slug: "audit" },
  { name: "Investment", slug: "investment" },
  { name: "Articleship", slug: "articleship" },
  { name: "Law & MCA", slug: "law-mca" },
];

// Dropdown options
const DROPDOWN_OPTIONS = [
  "Mentorship",
  "Files and Content",
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
  const [loggedIn, setLoggedIn] = useState(isUserLoggedIn());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setLoggedIn(false);
    setProfileDropdownOpen(false);
  };

  return (
    <>
      <header className="backdrop-blur-lg bg-black/80 text-white font-sans shadow-2xl rounded-b-2xl z-50 relative">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
          <Link href="/" className="text-3xl font-extrabold tracking-wide">
            MyProfession.CA
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-6 items-center text-lg">
            {NAV_LINKS.map(({ label, path }, i) => (
              <Link
                key={i}
                href={path}
                className={`transition duration-200 ${
                  pathname === path
                    ? "text-blue-400 font-semibold"
                    : "text-gray-300 hover:text-blue-400"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-2xl text-blue-400 ml-4">
              <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="hover:text-pink-500 transition" />
              </a>
              <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="hover:text-red-500 transition" />
              </a>
              <a href="mailto:yourmail@gmail.com">
                <FaEnvelope className="hover:text-green-500 transition" />
              </a>
            </div>

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
                  {loggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition duration-200 rounded-lg"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowLoginModal(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition duration-200 rounded-lg"
                      >
                        User Login
                      </button>
                      <Link
                        href="/register"
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition duration-200 rounded-lg"
                      >
                        Expert Profile
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-white text-2xl"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-4">
            {NAV_LINKS.map(({ label, path }, i) => (
              <Link
                key={i}
                href={path}
                className={`block transition duration-200 ${
                  pathname === path
                    ? "text-blue-400 font-semibold"
                    : "text-gray-300 hover:text-blue-400"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-2xl text-blue-400 mt-2">
              <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="hover:text-pink-500 transition" />
              </a>
              <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="hover:text-red-500 transition" />
              </a>
              <a href="mailto:yourmail@gmail.com">
                <FaEnvelope className="hover:text-green-500 transition" />
              </a>
            </div>

            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="block text-left w-full text-gray-300 hover:text-red-500 mt-2"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="block text-left w-full text-gray-300 hover:text-blue-400 mt-2"
                >
                  User Login
                </button>
                <Link
                  href="/register"
                  className="block text-gray-300 hover:text-blue-400 mt-2"
                >
                  Expert Profile
                </Link>
              </>
            )}
          </div>
        )}

        {/* Subheader with categories and dropdown */}
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
                  {category.name}
                  <IoMdArrowDropdown size={20} />
                </button>

                {openCategoryIndex === i && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-gray-800/95 backdrop-blur-md border border-gray-600 rounded-xl shadow-xl z-50 text-xl">
                    {DROPDOWN_OPTIONS.map((item, idx) => (
                      <Link
                        key={idx}
                        href={`/category/${category.slug}`}
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
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <AuthModal
          onClose={() => {
            setShowLoginModal(false);
            setLoggedIn(true);
            localStorage.setItem("isLoggedIn", "true");
          }}
        />
      )}
    </>
  );
}
