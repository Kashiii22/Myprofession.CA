"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Import icons for social media
import { FaLinkedin, FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import ConsultantJoinModal from "./ConsultantJoinModal";
import { setLoginSuccess } from "@/redux/authSlice";

// Helper component for footer links to keep code clean
const FooterLink = ({ href, children }) => (
  <li>
    <Link href={href} className="text-sm hover:text-white transition cursor-pointer">
      {children}
    </Link>
  </li>
);

const Footer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [showConsultantModal, setShowConsultantModal] = React.useState(false);

  const handleJoinAsConsultantClick = () => {
    if (isLoggedIn) {
      // If user is logged in, navigate directly to expert profile
      router.push('/expert-profile');
    } else {
      // If user is not logged in, show the consultant modal
      setShowConsultantModal(true);
    }
  };
  return (
    <footer className="bg-[#0e0e10] text-gray-400 px-6 md:px-20 py-16 border-t border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column 1: Brand Info */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white">
            MyProfession.<span className="text-blue-500">CA</span>
          </h3>
          <p className="mt-4 text-sm max-w-sm leading-relaxed">
            Empowering Chartered Accountants through expert mentorship, career
            guidance, and real-world resources.
          </p>
        </div>

        {/* Column 2: Platform Links */}
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-4 text-lg">Platform</h4>
          <ul className="space-y-3">
            <FooterLink href="/mentors">Consultants</FooterLink>
            <FooterLink href="/category/income-tax">Content & Files</FooterLink>
            <FooterLink href="/ComingSoon">Courses</FooterLink>
            <li>
  <button 
    onClick={handleJoinAsConsultantClick}
    className="text-sm hover:text-white transition cursor-pointer text-left"
  >
    Join As a Consultant
  </button>
</li>  
          </ul>
        </div>

        {/* Column 3: Legal & Support Links */}
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-4 text-lg">Legal & Support</h4>
          <ul className="space-y-3">
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
            <FooterLink href="/privacyPolicy">Privacy Policy</FooterLink>
            <FooterLink href="/terms-and-condition">Terms & Conditions</FooterLink>
            <FooterLink href="/refund-policy">Refund Policy</FooterLink>
          </ul>
        </div>

        {/* Column 4: Follow Us & Contact */}
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-4 text-lg">Follow Us</h4>
          <div className="flex gap-5 text-2xl">
            {/* Add your actual social media links here */}
            <a
              href="https://linkedin.com/your-page"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://youtube.com/your-channel"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-600 transition"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
            <a
              href="https://instagram.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com/your-page"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
          </div>

          <h4 className="text-white font-semibold mb-3 mt-6 text-lg">Contact Us</h4>
          <p className="text-sm">
            Email:{" "}
            <a
              href="mailto:support@myprofession.ca"
              className="text-blue-400 hover:underline"
            >
              support@myprofession.ca
            </a>
          </p>
          <p className="text-sm mt-1">Phone: +91-95697-49095</p>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="mt-16 border-t border-gray-700 pt-8 text-center text-sm">
        © {new Date().getFullYear()} MyProfession.CA. All rights reserved.
      </div>

      {/* Consultant Join Modal */}
      {showConsultantModal && (
        <ConsultantJoinModal
          onClose={() => setShowConsultantModal(false)}
          onLoginSuccess={(userData) => {
            setShowConsultantModal(false);
            dispatch(setLoginSuccess(userData));
          }}
        />
      )}
    </footer>
  );
};

export default Footer;