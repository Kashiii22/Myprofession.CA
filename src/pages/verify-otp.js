"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaShieldAlt } from "react-icons/fa";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const router = useRouter();

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      alert("OTP Verified Successfully!");
      router.push("/");
    } else {
      alert("Please enter a valid 6-digit OTP.");
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 text-white">
      <section className="bg-[#1c2938] border border-blue-700 rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="flex justify-center text-4xl text-blue-400 mb-4">
          <FaShieldAlt />
        </div>
        <h1 className="text-2xl font-bold text-center text-blue-400 mb-2">Verify OTP</h1>
        <p className="text-sm text-center text-gray-400 mb-6">
          Enter the 6-digit OTP sent to your number
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-14 rounded-lg text-center text-lg bg-[#1a2535] border border-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:opacity-90 transition duration-300 text-white py-2 rounded-lg font-semibold"
          >
            Verify OTP
          </button>
        </form>
      </section>
    </main>
  );
}
