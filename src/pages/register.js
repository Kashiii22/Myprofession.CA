"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// --- MAIN PAGE ---
export default function MentorOnboardingSection() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <>
      <Header />
      <section className="min-h-[calc(100vh-64px)] w-full bg-black text-white flex flex-wrap lg:flex-nowrap overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-1/2 flex justify-center items-center px-6 py-12 bg-black">
          <div className="flex flex-col gap-6 w-full max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Become a Mentor, <br /> Inspire the Future
            </h1>
            <p className="text-base sm:text-lg text-gray-400">
              Share your journey. Guide students. Shape careers.
            </p>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-12 mt-4 flex-wrap">
              <TypewriterStat label="Mentors" end={500} />
              <TypewriterStat label="Students Reached" end={12000} />
            </div>

            {/* Call to Action */}
            <Link
              href="/expert-profile"
              className="mt-6 px-6 py-3 text-lg bg-blue-700 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 w-fit shadow-lg"
            >
              Become a Mentor
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 bg-black">
          {/* Tabs */}
          <div className="flex space-x-4 sm:space-x-6 mb-8">
            <TabButton
              label="Login"
              active={activeTab === "login"}
              onClick={() => setActiveTab("login")}
            />
            <TabButton
              label="Check Registration Status"
              active={activeTab === "status"}
              onClick={() => setActiveTab("status")}
            />
          </div>

          <div className="w-full max-w-md">
            {activeTab === "login" ? <LoginForm /> : <StatusForm />}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

// --- COMPONENTS ---

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`text-sm sm:text-base font-medium transition-all duration-300 px-4 py-2 rounded-full ${
      active ? "bg-blue-700 text-white" : "text-gray-300 hover:text-white"
    }`}
  >
    {label}
  </button>
);

function TypewriterStat({ label, end }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(end / 100);
      if (current >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [end]);

  return (
    <div className="text-center min-w-[120px]">
      <div className="text-2xl sm:text-3xl font-bold text-blue-700">{count}+</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function LoginForm() {
  return (
    <form className="space-y-4 sm:space-y-5 w-full px-2 sm:px-0">
      <InputField type="tel" placeholder="Enter your phone number" />
      <InputField type="password" placeholder="Password" />
      <SubmitButton>Login</SubmitButton>
    </form>
  );
}

function StatusForm() {
  return (
    <form className="space-y-4 sm:space-y-5 w-full px-2 sm:px-0">
      <InputField type="email" placeholder="Enter your email to check status" />
      <SubmitButton>Check Status</SubmitButton>
    </form>
  );
}

const InputField = ({ type = "text", placeholder }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg bg-black border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200 text-sm sm:text-base"
  />
);

const SubmitButton = ({ children }) => (
  <button
    type="submit"
    className="w-full py-3 sm:py-4 px-6 bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg hover:scale-[1.03] focus:ring-2 focus:ring-blue-500 transition-transform shadow-md"
  >
    {children}
  </button>
);
