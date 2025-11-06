"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUserCircle, FaBars, FaTimes,
  FaInstagram, FaYoutube, FaEnvelope, FaSearch
} from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import AuthModal from "@/components/AuthModal";

// --- Helper function to get a cookie by name ---
const getCookie = (name) => {
  if (typeof window === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

const CATEGORIES = [
  { name: "Income Tax", slug: "income-tax" },
  { name: "GST", slug: "gst" },
  { name: "Accounting", slug: "accounting" },
  { name: "Audit", slug: "audit" },
  { name: "Investment", slug: "investment" },
  { name: "ICAI & Articleship", slug: "icai-and-articleship" },
  { name: "Law & MCA", slug: "law-and-mca" },
];

const DROPDOWN_OPTIONS = [
  "Mentorship",
  "Contents & Files",
  "Articles",
  "Courses",
  "Queries",
];

// 🔽 --- IMPORTANT: UPDATE THIS --- 🔽
// Set this to the exact name of your authentication cookie
const AUTH_COOKIE_NAME = "token";
// 🔼 --- IMPORTANT: UPDATE THIS --- 🔼

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const categoryRefs = useRef([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // ✅ State is now managed properly
  const [loggedIn, setLoggedIn] = useState(false); // Default to logged out
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Check for auth cookie on component mount (client-side only)
  useEffect(() => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (token) {
      setLoggedIn(true);
    }
  }, []); // Empty array ensures this runs only once on mount

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

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

  // ✅ Corrected Logout Handler
  const handleLogout = () => {
    // To delete the cookie, set its expiration to a past date.
    // MUST match the 'path' and 'domain' (if any) used when the cookie was set.
    // We assume the path is '/'. Update this if your cookie path is different.
    document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    // Update UI state
    setLoggedIn(false);
    setProfileDropdownOpen(false);
  };

  const getLinkPath = (item, category) => {
    switch (item) {
      case "Mentorship":
        return `/mentors?filter=${category.slug}`;
      case "Contents & Files":
        return `/category/${category.slug}`;
      default:
        return "/ComingSoon";
    }
  };

  return (
    <>
      <header className="backdrop-blur-lg bg-black/80 text-white font-sans shadow-2xl rounded-b-2xl z-50 relative">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-black">
          <Link href="/" className="text-3xl font-extrabold tracking-wide">
            MyProfession.CA
          </Link>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="h-5 w-5 text-gray-500" />
              </span>
              <input
                type="text"
                placeholder="Search any topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 rounded-full bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </form>
          </div>

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
            <form onSubmit={handleSearchSubmit} className="relative w-full pt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pt-2">
                <FaSearch className="h-5 w-5 text-gray-500" />
              </span>
              <input
                type="text"
                placeholder="Search any topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 rounded-full bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </form>

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

            {/* Social Icons with brand colors */}
            <div className="flex items-center gap-4 text-2xl text-blue-400 mt-2">
              <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-pink-500 hover:opacity-80 transition" />
              </a>
              <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="text-red-600 hover:opacity-80 transition" />
              </a>
              <a href="mailto:yourmail@gmail.com">
                <FaEnvelope className="text-gray-400 hover:text-white transition" />
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
                        href={getLinkPath(item, category)}
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
          // This prop is for when the user clicks "X" or outside
          onClose={() => {
            setShowLoginModal(false);
          }}
          // This new prop is for when login is SUCCESSFUL
          onLoginSuccess={() => {
            setShowLoginModal(false);
            setLoggedIn(true);
          }}
        />
      )}
    </>
  );
}