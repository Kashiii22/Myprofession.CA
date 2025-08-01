import { useState } from "react";

export default function MentorOnboardingSection() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <section className="min-h-screen w-full bg-[#0D1117] text-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-start gap-8 p-10">
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

        {/* Animated Register Button */}
        <a
          href="/mentor/register"
          className="mt-10 px-6 py-3 text-lg bg-yellow-500 text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
        >
          🚀 Become a Mentor
        </a>
      </div>

      {/* Right Panel */}
      <div className="lg:w-1/2 w-full bg-[#161B22] flex flex-col justify-center items-center p-10">
        {/* Tabs */}
        <div className="flex space-x-6 mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`text-lg font-medium transition-all duration-300 px-4 py-2 rounded-full ${
              activeTab === "login"
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`text-lg font-medium transition-all duration-300 px-4 py-2 rounded-full ${
              activeTab === "status"
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Check Registration Status
          </button>
        </div>

        {activeTab === "login" ? <LoginForm /> : <StatusForm />}
      </div>
    </section>
  );
}

function TypewriterStat({ label, end }) {
  const [count, setCount] = useState(0);

  useState(() => {
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
  }, []);

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-yellow-400">{count}+</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function LoginForm() {
  return (
    <form className="w-full max-w-md space-y-6">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 rounded bg-[#0D1117] border border-gray-600 text-white placeholder-gray-400"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 rounded bg-[#0D1117] border border-gray-600 text-white placeholder-gray-400"
      />
      <button
        type="submit"
        className="w-full py-3 bg-yellow-500 text-black font-semibold rounded hover:scale-105 transition-transform"
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
        className="w-full px-4 py-3 rounded bg-[#0D1117] border border-gray-600 text-white placeholder-gray-400"
      />
      <button
        type="submit"
        className="w-full py-3 bg-yellow-500 text-black font-semibold rounded hover:scale-105 transition-transform"
      >
        Check Status
      </button>
    </form>
  );
}
