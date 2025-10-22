"use client";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import Header from "@/components/Header";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ useRouter for Next.js App Router
import { ShinyButton } from "@/components/magicui/shiny-button";
import ChatbotWidget from "@/components/chatbotwidget";
// Mentor Data
const mentorsLeft = [
  { name: "CA Rohan Mehta", title: "Direct Tax Expert", image: "https://i.pravatar.cc/150?img=32", color: "bg-gradient-to-r from-indigo-700 to-indigo-900" },
  { name: "CA Anjali Verma", title: "Audit Mentor", image: "https://i.pravatar.cc/150?img=47", color: "bg-gradient-to-r from-pink-600 to-pink-800" },
  { name: "CA Karan Shah", title: "GST Specialist", image: "https://i.pravatar.cc/150?img=49", color: "bg-gradient-to-r from-blue-600 to-blue-800" },
];
const mentorsRight = [
  { name: "CA Nidhi Sinha", title: "Finance & Investment", image: "https://i.pravatar.cc/150?img=58", color: "bg-gradient-to-r from-teal-600 to-teal-800" },
  { name: "CA Manish Kapoor", title: "Accounts Guru", image: "https://i.pravatar.cc/150?img=60", color: "bg-gradient-to-r from-yellow-600 to-yellow-800" },
  { name: "CA Sneha Goyal", title: "CMA & Costing Mentor", image: "https://i.pravatar.cc/150?img=33", color: "bg-gradient-to-r from-rose-600 to-rose-800" },
];

export default function HomePage() {
  const router = useRouter();

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
            <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-[#0e0e10] via-[#0e0e10]/60 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/60 to-transparent z-20 pointer-events-none" />
          </div>

          {/* Center Content */}
          <div className="text-center" data-aos="fade-up">
            <h3 className="text-2xl md:text-3xl font-extrabold leading-snug">
              Connect with experienced <span className="text-blue-500"><br />CA Experts</span>
            </h3>

            <div className="mt-6 bg-[#1a1a1e]/90 p-8 rounded-xl border border-blue-700 shadow-md-blue w-full max-w-5xl text-center">
              <div className="text-white text-base md:text-lg leading-relaxed break-words">
                If you are facing any issue in your CA journey whether related to <br />
                <span className="text-cyan-400 font-medium">Study/ Articleship/ Guidance/ Job</span> <br />
                You can connect with our CA Experts for
                <span className="block mt-3 text-blue-400 font-semibold text-3xl">
                  1:1 Discussion
                </span>
              </div>
            </div>

            {/* Search and CTA */}
            <div className="mt-10 relative max-w-lg mx-auto">
              {/* Explore Mentors Button */}
              <div className="mt-6 flex justify-center">
                <ShinyButton
                  onClick={() => router.push("/mentors")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Explore Mentors →
                </ShinyButton>
              </div>
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
            <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-[#0e0e10] via-[#0e0e10]/60 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/60 to-transparent z-20 pointer-events-none" />
          </div>
        </div>

        {/* Keyframe Styles */}
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
            0% { transform: translateY(0%); }
            100% { transform: translateY(-50%); }
          }
          @keyframes scrollDown {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0%); }
          }
        `}</style>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-gradient-to-br from-[#111216] to-[#1b1f25] backdrop-blur-md py-20 px-6 md:px-20 text-white border-t border-[#2c2c32]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center" data-aos="fade-right">
            <img
              src="/unnamed.png"
              alt="Why Choose MyProfession.CA"
              className="max-w-md w-full drop-shadow-2xl rounded-2xl"
            />
          </div>
          <div data-aos="fade-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Why Choose <span className="text-blue-400">MyProfession.CA?</span>
            </h2>

            <ul className="space-y-6">
              {[
                {
                  icon: "💬",
                  title: <>Reach out to <span className="font-bold underline" >Mentors</span> to get solution for your any doubt</>,
                  path: "/mentors",
                },
                {
                  icon: "📚",
                  title: <>Enhance your practical knowledge with our <span className="font-bold underline">Content and Files</span></>,
                  path: "/category/income-tax",
                },
                {
                  icon: "📰",
                  title: <>Stay updated & ahead by reading the recent <span className="font-bold underline">Articles</span></>,
                  path: "/ComingSoon",
                },
              ].map(({ icon, title, path }, i) => (
                <li
                  key={i}
                  onClick={() => router.push(path)}
                  className="cursor-pointer flex items-start space-x-4 bg-[#1f1f23]/70 hover:bg-[#24242a]/80 transition rounded-xl p-5 border border-gray-700 shadow-xl hover:shadow-2xl"
                  data-aos="zoom-in"
                  data-aos-delay={i * 150}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl rounded-full text-white bg-gradient-to-br from-blue-700 to-indigo-800 shadow-lg">
                    {icon}
                  </div>
                  <p className="text-white text-xl leading-relaxed">{title}</p>
                </li>
              ))}
            </ul>
          </div>
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
              Email: <a href="mailto:support@myprofession.ca" className="text-blue-500 hover:underline">support@myprofession.ca</a>
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
      <ChatbotWidget />
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
