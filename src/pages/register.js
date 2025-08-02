import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MentorOnboardingSection() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <>
      <Header />
      <section className="min-h-[calc(100vh-64px)] w-full bg-black text-white flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="lg:w-1/2 w-full flex justify-center items-center px-6 py-12">
          <div className="flex flex-col gap-8 text-left w-full max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Become a Mentor, <br /> Inspire the Future
            </h1>

            <div className="text-lg text-gray-400">
              Share your journey. Guide students. Shape careers.
            </div>

            {/* Typewriter Counter */}
            <div className="flex gap-10 mt-4">
              <TypewriterStat label="Mentors" end={500} />
              <TypewriterStat label="Students Reached" end={12000} />
            </div>

            {/* Register Button */}
            <Link
              href="/expert-profile"
              className="mt-10 px-6 py-3 text-lg bg-blue-700 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-lg w-fit"
            >
               Become a Mentor
            </Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-1/2 w-full bg-black flex flex-col justify-center items-center px-6 py-12">
          {/* Tabs */}
          <div className="flex space-x-6 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`text-lg font-medium transition-all duration-300 px-4 py-2 rounded-full ${
                activeTab === "login"
                  ? "bg-blue-700 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`text-lg font-medium transition-all duration-300 px-4 py-2 rounded-full ${
                activeTab === "status"
                  ? "bg-blue-700 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Check Registration Status
            </button>
          </div>

          {activeTab === "login" ? <LoginForm /> : <StatusForm />}
        </div>
      </section>
      <Footer />
    </>
  );
}

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
    <div className="text-center">
      <div className="text-3xl font-bold text-blue-700">{count}+</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function LoginForm() {
  return (
    <form className="w-full max-w-md space-y-6">
      <input
        type="string"
        placeholder="Enter your phone number"
        className="w-full px-4 py-3 rounded bg-black border border-gray-600 text-white placeholder-gray-400"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 rounded bg-black border border-gray-600 text-white placeholder-gray-400"
      />
      <button
        type="submit"
        className="w-full py-3 bg-blue-700 text-white font-semibold rounded hover:scale-105 transition-transform"
      >
        Login
      </button>
    </form>
  );
}

function StatusForm() {
  return (
    <form className="w-full max-w-md space-y-6">
      <input
        type="email"
        placeholder="Enter your email to check status"
        className="w-full px-4 py-3 rounded bg-black border border-gray-600 text-white placeholder-gray-400"
      />
      <button
        type="submit"
        className="w-full py-3 bg-blue-700 text-white font-semibold rounded hover:scale-105 transition-transform"
      >
        Check Status
      </button>
    </form>
  );
}
