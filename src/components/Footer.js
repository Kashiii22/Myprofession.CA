import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0e0e10] text-gray-400 py-10 px-6 md:px-20 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-bold text-white">
            MyProfession.<span className="text-blue-500">CA</span>
          </h3>
          <p className="mt-2 text-sm max-w-xs">
            Empowering Chartered Accountants through expert mentorship, career guidance, and real-world resources.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {["About Us", "Courses", "Contact", "Privacy Policy"].map((link, i) => (
              <li key={i}>
                <a href="#" className="hover:text-white transition">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <p className="text-sm">
            Email:{" "}
            <a href="mailto:support@myprofession.ca" className="text-blue-500 hover:underline">
              support@myprofession.ca
            </a>
          </p>
          <p className="text-sm">Phone: +91-9876543210</p>
          <div className="mt-3 flex gap-4 text-xl">
            <a href="#" className="hover:text-white">🔗</a>
            <a href="#" className="hover:text-white">💼</a>
            <a href="#" className="hover:text-white">📘</a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm">
        © {new Date().getFullYear()} MyProfession.CA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
