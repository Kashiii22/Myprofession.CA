"use client";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import Header from "@/components/Header";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

// Mentor Data
const mentorsLeft = [
  { name: "CA Rohan Mehta", title: "Direct Tax Expert", image: "/mentors/rohan.png", color: "bg-gradient-to-r from-indigo-700 to-indigo-900" },
  { name: "CA Anjali Verma", title: "Audit Mentor", image: "/mentors/anjali.png", color: "bg-gradient-to-r from-pink-600 to-pink-800" },
  { name: "CA Karan Shah", title: "GST Specialist", image: "/mentors/karan.png", color: "bg-gradient-to-r from-blue-600 to-blue-800" },
];
const mentorsRight = [
  { name: "CA Nidhi Sinha", title: "Finance & Investment", image: "/mentors/nidhi.png", color: "bg-gradient-to-r from-teal-600 to-teal-800" },
  { name: "CA Manish Kapoor", title: "Accounts Guru", image: "/mentors/manish.png", color: "bg-gradient-to-r from-yellow-600 to-yellow-800" },
  { name: "CA Sneha Goyal", title: "CMA & Costing Mentor", image: "/mentors/sneha.png", color: "bg-gradient-to-r from-rose-600 to-rose-800" },
];

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e10] text-gray-200 font-sans relative">
      <Header />

      {/* HERO SECTION */}
      <section className="relative z-10 px-4 md:px-10 py-20 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Left Marquee */}
          <div className="hidden md:block h-[400px] overflow-hidden relative group">
            <div className="marquee-container animate-scroll-up group-hover:[animation-play-state:paused]">
              {[...Array(6)].map((_, loopIndex) =>
                mentorsLeft.map((mentor, idx) => (
                  <MentorCard key={`left-${loopIndex}-${idx}`} mentor={mentor} />
                ))
              )}
            </div>
            <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-[#0e0e10] via-[#0e0e10]/60 to-transparent pointer-events-none z-20" />
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/60 to-transparent pointer-events-none z-20" />
          </div>

          {/* Center Text */}
          <div className="text-center" data-aos="fade-up">
            <h3 className="text-2xl md:text-3xl font-extrabold leading-snug">
             Connect with experienced <span className="text-blue-500">CA Experts</span>
            </h3>
            <p className="mt-4 text-gray-400 text-base md:text-lg max-w-md mx-auto leading-relaxed">
If You are facing any issue in your CA journey whether related to Study/Articleship/Guidance/Job,You can connect to our CA Experts for   1:1 discussion        </p>
            {/* Search Bar */}
            <div className="mt-10 relative max-w-lg mx-auto" data-aos="zoom-in" data-aos-delay="100">
              <input
                type="text"
                placeholder="Search mentors, resources, queries..."
                className="w-full py-4 pl-12 pr-4 rounded-full bg-[#1a1a1d] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Right Marquee */}
          <div className="hidden md:block h-[400px] overflow-hidden relative group">
            <div className="marquee-container animate-scroll-down group-hover:[animation-play-state:paused]">
              {[...Array(6)].map((_, loopIndex) =>
                mentorsRight.map((mentor, idx) => (
                  <MentorCard key={`right-${loopIndex}-${idx}`} mentor={mentor} />
                ))
              )}
            </div>
            <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-[#0e0e10] via-[#0e0e10]/60 to-transparent pointer-events-none z-20" />
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/60 to-transparent pointer-events-none z-20" />
          </div>
        </div>

        {/* Category Buttons */}
        <div className="mt-16 flex flex-wrap justify-center gap-4 px-4 md:px-20" data-aos="fade-up" data-aos-delay="200">
          {[
            ["Before CA", "from-gray-800 to-gray-900"],
            ["Foundation", "from-blue-600 to-blue-800"],
            ["CA Inter", "from-green-600 to-green-800"],
            ["Articleship", "from-yellow-600 to-yellow-800"],
            ["CA Final", "from-purple-600 to-purple-800"],
            ["After CA", "from-pink-600 to-pink-800"],
          ].map(([text, color], i) => (
            <CategoryButton key={i} text={text} color={color} />
          ))}
        </div>

        {/* Animation Keyframes */}
        <style jsx>{`
          .marquee-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          .animate-scroll-up {
            animation: scrollUp 30s linear infinite;
          }
          .animate-scroll-down {
            animation: scrollDown 30s linear infinite;
          }
          @keyframes scrollUp {
            0% {
              transform: translateY(0%);
            }
            100% {
              transform: translateY(-50%);
            }
          }
          @keyframes scrollDown {
            0% {
              transform: translateY(-50%);
            }
            100% {
              transform: translateY(0%);
            }
          }
        `}</style>
      </section>

      {/* Our Features Section */}
      <section className="bg-[#ffffff] py-20 px-6 md:px-20 text-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">
          <span className="text-black">Why Choose MyProfession.CA?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {[
            {
              icon: "📚",
              title: "Structured Learning Paths",
              desc: "Roadmaps tailored to every stage of your CA journey.",
              color: "from-blue-700 to-indigo-800",
            },
            {
              icon: "💬",
              title: "24x7 Doubt Support",
              desc: "Instant help from mentors and peers whenever you're stuck.",
              color: "from-green-700 to-emerald-800",
            },
            {
              icon: "🎓",
              title: "Top CA Mentors",
              desc: "Guidance from experts, rank holders & industry leaders.",
              color: "from-purple-700 to-fuchsia-800",
            },
          ].map(({ icon, title, desc, color }, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              data-aos-delay={i * 150}
              className="bg-[#1d1d22]/60 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition duration-300 group"
            >
              <div className={`w-14 h-14 flex items-center justify-center text-2xl rounded-full mb-4 text-white bg-gradient-to-br ${color} shadow-lg`}>
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">{title}</h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0e0e10] text-gray-400 py-10 px-6 md:px-20 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <h3 className="text-2xl font-bold text-white">
              MyProfession.<span className="text-blue-500">CA</span>
            </h3>
            <p className="mt-2 text-sm max-w-xs">
              Empowering Chartered Accountants through expert mentorship, career guidance, and real-world resources.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "Courses", "Contact", "Privacy Policy"].map((link, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-white transition">{link}</a>
                </li>
              ))}
            </ul>
          </div>
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
    </div>
  );
}

// Mentor Card
function MentorCard({ mentor }) {
  return (
    <div className={`flex items-center gap-4 p-4 mx-auto max-w-xs rounded-xl shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl ${mentor.color}`}>
      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white">
        <Image src={mentor.image} alt={mentor.name} fill className="object-cover" />
      </div>
      <div className="text-left">
        <div className="text-md font-semibold text-white">{mentor.name}</div>
        <div className="text-sm text-gray-200">{mentor.title}</div>
      </div>
    </div>
  );
}

// Category Button
function CategoryButton({ text, color }) {
  return (
    <button
      className={`bg-gradient-to-r ${color} text-white font-semibold py-2 px-5 rounded-full shadow-md hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out whitespace-nowrap`}
    >
      {text}
    </button>
  );
}
