"use client";

import { useEffect, useRef, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function VerifyOtpModal({ phone, onClose }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [counter, setCounter] = useState(30);
  const inputsRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
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
    const code = otp.join("");
    if (code.length === 6) {
      toast.success("OTP Verified!");
      onClose();
    } else {
      toast.error("Please enter all 6 digits.");
    }
  };

  const handleResend = () => {
    if (counter === 0) {
      toast.success("OTP resent to " + phone);
      setCounter(30);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1c2938] border border-blue-700 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-red-400"
        >
          &times;
        </button>

        <div className="flex justify-center text-4xl text-blue-400 mb-4">
          <FaShieldAlt />
        </div>
        <h1 className="text-2xl font-bold text-center text-blue-400 mb-2">
          Verify OTP
        </h1>
        <p className="text-sm text-center text-gray-400 mb-6">
          Enter the 6-digit OTP sent to {phone}
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
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Resend in{" "}
              <span className="text-blue-400 font-medium">{counter}s</span>
            </span>
            <button
              type="button"
              disabled={counter > 0}
              onClick={handleResend}
              className={`font-semibold ${
                counter === 0
                  ? "text-blue-500 hover:underline"
                  : "text-gray-500 cursor-not-allowed"
              }`}
            >
              Resend OTP
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:opacity-90 transition duration-300 text-white py-2 rounded-lg font-semibold"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
