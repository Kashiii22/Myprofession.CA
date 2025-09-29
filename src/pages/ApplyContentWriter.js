"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ApplyContentWriter() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application Submitted Successfully! We will contact you soon.");
    setFullName("");
    setEmail("");
    setMobile("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Panel: Inspiring Quotes */}
          <aside className="md:w-1/2 flex flex-col justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-8 shadow-xl text-center md:text-left border-2 border-purple-600">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Join Our Content Creator Family
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-4">
              Share your expertise in tax, finance & compliance with thousands of readers.
              Make an impact, grow your audience, and showcase your knowledge!
            </p>

            <blockquote className="text-xl md:text-2xl italic text-pink-400 font-semibold mt-6">
              "Writing is the painting of the voice. Your words can inspire a nation."
            </blockquote>
            <p className="text-gray-300 mt-2">
              Step into a community that values your insight and rewards your passion.  
              Highlight your expertise and help others grow financially.
            </p>
          </aside>

          {/* Right Panel: Form */}
          <section className="md:w-1/2 bg-gray-900 rounded-3xl p-8 shadow-xl border-2 border-blue-500">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-6 text-center">
              Apply Now
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-transparent text-gray-100 text-base md:text-lg focus:outline-none focus:ring-3 focus:ring-blue-500/70 transition-all"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-transparent text-gray-100 text-base md:text-lg focus:outline-none focus:ring-3 focus:ring-green-400/70 transition-all"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-transparent text-gray-100 text-base md:text-lg focus:outline-none focus:ring-3 focus:ring-purple-400/70 transition-all"
              />

              {/* Updated textarea */}
              <p className="text-gray-300 font-medium mb-1">Your Expertise</p>
              <textarea
                placeholder="Share your expertise in tax, finance & compliance"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-transparent text-gray-100 text-base md:text-lg focus:outline-none focus:ring-3 focus:ring-indigo-400/70 transition-all"
              />

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 rounded-xl text-lg md:text-xl font-semibold text-white shadow-lg transition-all transform hover:scale-105"
              >
                Submit Application
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
