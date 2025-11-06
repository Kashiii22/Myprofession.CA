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

const AUTH_COOKIE_NAME = "token";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const categoryRefs = useRef([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // --- NEW (1 of 4): State to remember where the user wanted to go ---
  const [pendingRedirect, setPendingRedirect] = useState(null);

  useEffect(() => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (token) {
      setLoggedIn(true);
    }
  }, []);

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

  const handleLogout = () => {
    document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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
  
  // --- NEW (2 of 4): Function to handle the "Become an Expert" click ---
  const handleExpertRegistrationClick = () => {
    if (loggedIn) {
      // If user is logged in, send them directly to the register page
      router.push('/register');
    } else {
      // If logged out, remember the redirect and show the login modal
      setPendingRedirect('/register');
      setShowLoginModal(true);
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
          <nav className="hidden md:flex gap-4 items-center text-lg">
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

            {/* --- NEW (3 of 4): Changed from <Link> to <button> --- */}
            <button
              onClick={handleExpertRegistrationClick}
              className="text-md font-medium px-4 py-2 bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-900/50 rounded-lg transition"
            >
              Become an Expert
            </button>

            {/* --- Conditional Login/Profile Button --- */}
            {loggedIn ? (
              // LOGGED-IN: Show Profile Icon
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1 hover:text-blue-400 transition duration-200"
                >
                  <FaUserCircle size={28} />
                  <IoMdArrowDropdown />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-gray-900/90 backdrop-blur-md shadow-xl border border-gray-700 rounded-xl z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition duration-200 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // LOGGED-OUT: Show Direct Button (Solid)
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-md font-medium px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Login / Sign Up
              </button>
            )}
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

            {/* Social Icons */}
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

            {/* --- Professional Mobile Auth Section --- */}
            <div className="space-y-3 pt-4 border-t border-gray-700/50">
              {loggedIn ? (
                // LOGGED-IN (MOBILE)
                <button
                  onClick={handleLogout}
                  className="block text-center w-full px-4 py-2 bg-red-600/50 border border-red-500 text-red-300 hover:bg-red-500/50 rounded-lg transition"
                >
                  Logout
                </button>
              ) : (
                // LOGGED-OUT (MOBILE) - Primary Action
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="block text-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Login / Sign Up
                </button>
              )}

              {/* --- NEW (3 of 4): Changed from <Link> to <button> --- */}
              <button
                onClick={() => {
                  handleExpertRegistrationClick();
                  setMobileMenuOpen(false);
                }}
                className="block text-center w-full px-4 py-2 bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-900/50 rounded-lg transition"
              >
                Become an Expert
              </button>
            </div>
            
          </div>
        )}

        {/* --- FULL SUBHEADER CODE --- */}
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
          onClose={() => {
            setShowLoginModal(false);
            setPendingRedirect(null); // Clear the redirect if they just close the modal
          }}
          // --- NEW (4 of 4): Updated onLoginSuccess to handle the redirect ---
          onLoginSuccess={() => {
            setShowLoginModal(false);
            setLoggedIn(true);
            
            // Check if we have a pending redirect
            if (pendingRedirect) {
              router.push(pendingRedirect);
              setPendingRedirect(null); // Clear the state
            }
          }}
        />
      )}
    </>
  );
}