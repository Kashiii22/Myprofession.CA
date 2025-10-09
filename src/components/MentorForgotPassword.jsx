"use client";

import { useState, useEffect, useRef } from "react";

// --- Toast Notification Component ---
// A simple, reusable toast component for notifications.
const Toast = ({ message, show }) => {
  // If no message or not set to show, it's invisible and non-interactive
  if (!show) {
    return null;
  }
  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg z-[60] animate-fade-in-out"
    >
      {message}
    </div>
  );
};

// --- MAIN MODAL COMPONENT ---
export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [modalStep, setModalStep] = useState("enterMobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // --- NEW: Effect to prevent background scrolling ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function to reset style when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset to the first step whenever the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setModalStep("enterMobile");
        setMobileNumber("");
      }, 300); // Wait for closing animation
    }
  }, [isOpen]);

  const handleMobileSubmit = (number) => {
    setMobileNumber(number);
    setModalStep("verifyOtp");
    // --- NEW: Trigger Toast Notification ---
    setToastMessage("OTP sent successfully!");
    setTimeout(() => setToastMessage(""), 3000); // Hide toast after 3 seconds
  };

  const handleOtpSuccess = () => {
    setModalStep("resetPassword");
  };

  const handlePasswordResetSuccess = () => {
    alert("Password has been reset successfully!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* The main modal container with enhanced blur */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
        <div className="relative w-full max-w-md p-6 sm:p-8 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-blue-900/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            {/* Close Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {modalStep === "enterMobile" && <EnterMobileStep onSubmit={handleMobileSubmit} />}
          {modalStep === "verifyOtp" && <VerifyOtpStep mobileNumber={mobileNumber} onVerifySuccess={handleOtpSuccess} />}
          {modalStep === "resetPassword" && <ResetPasswordStep onResetSuccess={handlePasswordResetSuccess} />}
        </div>
      </div>
      {/* Toast component is rendered here */}
      <Toast message={toastMessage} show={toastMessage !== ""} />
    </>
  );
}

// --- STEP 1: Enter Mobile Number ---
const EnterMobileStep = ({ onSubmit }) => {
  const [number, setNumber] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (number.length >= 10) onSubmit(number);
    else alert("Please enter a valid mobile number.");
  };
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
      <p className="text-gray-400">Enter your mobile number to receive a verification code.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
        <input type="tel" placeholder="Enter your mobile number" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
        <button type="submit" className="w-full py-3 px-6 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">Send OTP</button>
      </form>
    </div>
  );
};

// --- STEP 2: Verify OTP (with 6 single input boxes) ---
const VerifyOtpStep = ({ mobileNumber, onVerifySuccess }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);
  
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setCountdown(30);
      setIsResending(false);
      setOtp(new Array(6).fill(""));
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }, 1000);
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.value !== "" && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp === "123456") onVerifySuccess();
    else alert("Invalid OTP. Please try again.");
  };

  return (
    <div className="flex flex-col gap-4 text-center">
      <h2 className="text-2xl font-bold text-white">Verify Your Mobile</h2>
      <p className="text-gray-400">Enter the 6-digit code sent to <span className="font-semibold text-white">+91 {mobileNumber}</span></p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((data, index) => (
            <input key={index} type="text" maxLength="1" value={data} onChange={(e) => handleChange(e.target, index)} onKeyDown={(e) => handleKeyDown(e, index)} ref={(el) => (inputRefs.current[index] = el)} className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
          ))}
        </div>
        <button type="submit" className="w-full py-3 px-6 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">Verify</button>
      </form>
      <div className="mt-2 text-sm text-gray-400">
        Didn't receive code?{" "}
        <button onClick={handleResend} disabled={countdown > 0 || isResending} className="font-semibold text-blue-400 disabled:text-gray-500 disabled:cursor-not-allowed hover:underline">
          {isResending ? "Sending..." : "Resend"}{countdown > 0 && ` in ${countdown}s`}
        </button>
      </div>
    </div>
  );
};

// --- STEP 3: Reset New Password ---
const ResetPasswordStep = ({ onResetSuccess }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    onResetSuccess();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-white">Set New Password</h2>
      <p className="text-gray-400">Create a new, strong password for your account.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
        <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
        <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
        <button type="submit" className="w-full py-3 px-6 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">Reset Password</button>
      </form>
    </div>
  );
};