"use client";
import { useState } from "react";
import Image from "next/image";
import GoogleIcon from "./GoogleIcon";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthModal({ onClose }) {
const [isLogin, setIsLogin] = useState(true);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const toggleTab = () => setIsLogin((prev) => !prev);

return (
<div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center px-4">
<div data-aos="zoom-in" className="backdrop-blur-xl bg-[#0e1625]/80 border border-blue-800 ring-1 ring-blue-500/30 shadow-[0_0_40px_#1e3a8a55] rounded-2xl flex w-full max-w-5xl overflow-hidden transition-all duration-700" >
{/* Left Illustration */}
<div className="hidden md:flex w-1/2 bg-transparent flex-col justify-center items-center p-8">
<Image src="/illustration2.png" alt="Illustration" width={320} height={320} className="object-contain mb-4" />
<h2 className="text-xl font-semibold text-blue-300 text-center px-4 leading-snug">
Learn, Connect & Grow with our Expert Mentors!
</h2>
</div>
    {/* Right Form Section */}
    <div
      data-aos="fade-left"
      className="w-full md:w-1/2 text-white flex flex-col justify-center items-center relative overflow-hidden bg-transparent"
    >
      <div className="w-full px-8 py-6 relative h-[500px]">
        {/* Tabs */}
        <div className="flex justify-center mb-6 bg-[#1c2938] rounded-full overflow-hidden w-full max-w-xs mx-auto">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 font-semibold text-sm cursor-pointer transition-all w-full ${
              isLogin ? "bg-blue-600 text-white" : "text-gray-400"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 font-semibold text-sm cursor-pointer transition-all w-full ${
              !isLogin ? "bg-blue-600 text-white" : "text-gray-400"
            }`}
          >
            Signup
          </button>
        </div>

        {/* Form Slider */}
        <div className="relative w-full max-w-md h-full overflow-hidden">
          <div
            className={`transition-transform duration-700 ease-in-out flex w-[200%] absolute top-0 left-0 ${
              isLogin ? "translate-x-0" : "-translate-x-1/2"
            }`}
          >
            {/* Login Form */}
            <div className="w-1/2 p-2 flex flex-col justify-between h-full">
              <form className="space-y-4 w-full">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded focus:outline-none focus:ring focus:ring-blue-400"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded pr-10 focus:outline-none focus:ring focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-sm text-blue-400 hover:underline cursor-pointer">
                  Forgot password?
                </p>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition"
                >
                  Login
                </button>
              </form>

              <div className="mt-6">
                <div className="flex items-center my-4 w-full">
                  <div className="h-px bg-gray-600 flex-grow" />
                  <span className="mx-3 text-gray-400 text-sm">or</span>
                  <div className="h-px bg-gray-600 flex-grow" />
                </div>
                <button className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-medium px-4 py-2 rounded shadow hover:opacity-90 transition">
                  <GoogleIcon /> Continue with Google
                </button>
              </div>
            </div>

            {/* Signup Form */}
            <div className="w-1/2 p-2 flex flex-col justify-between h-full">
              <form className="space-y-4 w-full">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded focus:outline-none focus:ring focus:ring-blue-400"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded focus:outline-none focus:ring focus:ring-blue-400"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded pr-10 focus:outline-none focus:ring focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded pr-10 focus:outline-none focus:ring focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition"
                >
                  Signup
                </button>
              </form>

              <div className="mt-6">
                <div className="flex items-center my-4 w-full">
                  <div className="h-px bg-gray-600 flex-grow" />
                  <span className="mx-3 text-gray-400 text-sm">or</span>
                  <div className="h-px bg-gray-600 flex-grow" />
                </div>
                <button className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-medium px-4 py-2 rounded shadow hover:opacity-90 transition">
                  <GoogleIcon /> Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt */}
        <p className="text-sm text-center text-gray-400 mt-4">
          {isLogin ? "Not a member?" : "Already have an account?"}{" "}
          <button
            onClick={toggleTab}
            className="text-blue-500 hover:underline font-medium cursor-pointer"
          >
            {isLogin ? "Signup now" : "Login"}
          </button>
        </p>
      </div>
    </div>
  </div>
</div>
);
}