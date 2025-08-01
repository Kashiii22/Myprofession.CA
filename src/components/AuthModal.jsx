"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GoogleIcon from "./GoogleIcon";

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [closing, setClosing] = useState(false);
  const router = useRouter();

  const toggleTab = () => {
    setIsLogin((prev) => !prev);
    setPhone("");
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      router.push("./verify-otp");
    } else {
      alert("Please enter a valid 10-digit phone number.");
    }
  };

  const handleClose = () => {
    console.log("Closing true");
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // matches transition duration
  };

  const InputField = ({ type = "text", placeholder, value, onChange }) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={type === "tel" ? 10 : undefined}
      className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded focus:outline-none focus:ring focus:ring-blue-400"
    />
  );

  const GoogleAuthButton = () => (
    <div className="mt-6">
      <div className="flex items-center my-4">
        <div className="h-px bg-gray-600 flex-grow" />
        <span className="mx-3 text-gray-400 text-sm">or</span>
        <div className="h-px bg-gray-600 flex-grow" />
      </div>
      <button className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-medium px-4 py-2 rounded shadow hover:opacity-90 transition">
        <GoogleIcon /> Continue with Google
      </button>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/70 flex justify-center items-center px-4 transition-opacity duration-300 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative backdrop-blur-xl bg-[#0e1625]/80 border border-blue-800 ring-1 ring-blue-500/30 shadow-[0_0_60px_#1e3a8acc] rounded-2xl flex w-full max-w-5xl overflow-hidden transition-all duration-300 transform ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* ❌ Close Button - Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ Prevent backdrop click conflict
            handleClose();
          }}
          className="absolute top-4 right-4 text-white text-2xl hover:text-red-400 transition rounded-full p-1 shadow-md hover:shadow-lg focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Left Illustration */}
        <div className="hidden md:flex w-1/2 flex-col justify-center items-center p-8">
          <Image
            src="/illustration2.png"
            alt="Illustration"
            width={320}
            height={320}
            className="object-contain mb-4"
          />
          <h2 className="text-xl font-semibold text-blue-300 text-center px-4 leading-snug">
            Learn, Connect & Grow with our Expert Mentors!
          </h2>
        </div>

        {/* Right Auth Form */}
        <div className="w-full md:w-1/2 text-white flex flex-col justify-center items-center bg-transparent">
          <div className="w-full px-8 py-6 relative h-[500px]">
            <div className="flex justify-center mb-6 bg-[#1c2938] rounded-full overflow-hidden w-full max-w-xs mx-auto">
              {["Login", "Signup"].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setIsLogin(i === 0)}
                  className={`px-6 py-2 font-semibold text-sm w-full transition-all ${
                    isLogin === (i === 0)
                      ? "bg-blue-600 text-white"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-md h-full overflow-hidden">
              <div
                className={`transition-transform duration-700 ease-in-out flex w-[200%] absolute top-0 left-0 ${
                  isLogin ? "translate-x-0" : "-translate-x-1/2"
                }`}
              >
                {/* Login */}
                <div className="w-1/2 p-2 flex flex-col justify-between h-full">
                  <form onSubmit={handleSendOtp} className="space-y-4 w-full">
                    <InputField
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition"
                    >
                      Send OTP
                    </button>
                  </form>
                  <p className="text-sm text-right text-blue-500 mt-2 cursor-pointer hover:underline">
                    Forgot Password?
                  </p>
                  <GoogleAuthButton />
                </div>

                {/* Signup */}
                <div className="w-1/2 p-2 flex flex-col justify-between h-full">
                  <form className="space-y-4 w-full">
                    <InputField placeholder="Full Name" />
                    <InputField type="tel" placeholder="Phone Number" />
                    <InputField type="password" placeholder="Create Password" />
                    <InputField type="password" placeholder="Confirm Password" />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition"
                    >
                      Signup
                    </button>
                  </form>
                  <GoogleAuthButton />
                </div>
              </div>
            </div>

            {/* Toggle Link */}
            <p className="text-sm text-center text-gray-400 mt-4">
              {isLogin ? "Not a member?" : "Already have an account?"}{" "}
              <button
                onClick={toggleTab}
                className="text-blue-500 hover:underline font-medium"
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
