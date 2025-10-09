"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginWithOTP, verifyLoginOTP } from "@/lib/api/mentorRegistration"; // Adjust path if needed

// Assuming you have these components in your project
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// --- GLOBAL UI COMPONENTS ---

const BackgroundIllustration = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{ stopColor: 'rgba(37, 99, 235, 0.2)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(37, 99, 235, 0)', stopOpacity: 1 }} />
                </radialGradient>
                <radialGradient id="grad2" cx="0%" cy="100%" r="80%" fx="0%" fy="100%">
                    <stop offset="0%" style={{ stopColor: 'rgba(6, 182, 212, 0.2)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(6, 182, 212, 0)', stopOpacity: 1 }} />
                </radialGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grad1)" />
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grad2)" />
        </svg>
    </div>
);

const InputField = ({ type = "text", placeholder, value, onChange, disabled = false }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} required className="w-full px-5 py-3 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-sm" />
);

const SubmitButton = ({ children, onClick, disabled = false }) => (
  <button type="submit" onClick={onClick} disabled={disabled} className="w-full py-3 px-6 bg-blue-600 text-white text-base font-semibold rounded-full hover:bg-blue-500 hover:scale-[1.03] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 shadow-md disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100">
    {children}
  </button>
);

const Toast = ({ message, show, isError = false }) => {
    if (!show) return null;
    return <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 ${isError ? 'bg-red-600' : 'bg-green-600'} text-white rounded-full shadow-lg z-[60] animate-fade-in-out`}>{message}</div>;
};


// --- MAIN PAGE COMPONENT ---
export default function FriendlyMentorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-gray-900 text-white flex flex-col lg:flex-row">
        
        <div className="relative w-full lg:w-1/2 flex justify-center items-center p-8 sm:p-12">
            <BackgroundIllustration />
            <div className="relative z-10 flex flex-col gap-6 w-full max-w-lg">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
                    Share Your Wisdom. <br /> Shape the Future.
                </h1>
                <p className="text-lg text-gray-300">
                    Join our vibrant community of mentors. Your experience is the guide our next generation of leaders needs.
                </p>
                <Link href="/about-mentorship" className="mt-4 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors w-fit">
                    Learn more about being a mentor &rarr;
                </Link>
            </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-black">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-center text-white">Get Started Today</h2>
                    <p className="text-gray-400 text-center mt-2">Ready to make a difference? Create your profile.</p>
                    <Link
                        href="/expert-profile"
                        className="block w-full mt-6 px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-900/40"
                    >
                        Join As Mentor
                    </Link>
                </div>
                
                <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">Or</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                <LoginForm />
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


// --- LOGIN FORM & Associated Components ---

function LoginForm() {
  const [method, setMethod] = useState("password");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
  };

  return (
    <div className="w-full p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
        <Toast message={toast.message} show={toast.show} isError={toast.isError} />
        <h3 className="text-xl font-semibold text-center text-white mb-4">Mentor Login</h3>
        <div className="flex w-full mb-6 bg-black p-1 rounded-full border border-gray-700">
            <button onClick={() => setMethod("password")} className={`w-1/2 p-2 rounded-full text-sm font-semibold transition-colors ${method === "password" ? "bg-blue-600 text-white" : "text-gray-400"}`}>
                Password
            </button>
            <button onClick={() => setMethod("otp")} className={`w-1/2 p-2 rounded-full text-sm font-semibold transition-colors ${method === "otp" ? "bg-blue-600 text-white" : "text-gray-400"}`}>
                OTP
            </button>
        </div>

        {method === "password" ? (
            <LoginWithPassword onForgotPassword={() => setIsForgotPasswordOpen(true)} />
        ) : (
            <LoginWithOTP showToast={showToast} />
        )}
        
        <ForgotPasswordModal
            isOpen={isForgotPasswordOpen}
            onClose={() => setIsForgotPasswordOpen(false)}
        />
    </div>
  );
}

function LoginWithPassword({ onForgotPassword }) {
  const handleSubmit = (e) => { e.preventDefault(); alert("Password login not implemented."); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <InputField type="tel" placeholder="Enter your mobile number" />
      <InputField type="password" placeholder="Password" />
      <div className="text-right">
        <button type="button" onClick={onForgotPassword} className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline">
          Forgot Password?
        </button>
      </div>
      <SubmitButton>Login</SubmitButton>
    </form>
  );
}

function LoginWithOTP({ showToast }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isProfileActive, setIsProfileActive] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      showToast("Please enter a valid 10-digit phone number.", true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginWithOTP(phone);
      if (response.success) {
        showToast("OTP sent successfully!");
        setIsProfileActive(response.isProfileActive);
        setOtpSent(true);
      }
    } catch (error) {
      console.log(error)
      showToast(error.message || "Failed to send OTP.", true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      showToast("Please enter a valid OTP.", true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyLoginOTP({ phone, otp });
      if (response.success) {
        showToast("Login successful!");
        localStorage.setItem('mentorToken', response.token); 
        
        // Redirect based on the active status received in the first step
        if (isProfileActive) {
          router.push('/mentor/dashboard');
        } else {
          router.push('/mentor/complete-profile');
        }
      }
    } catch (error) {
      showToast(error.message || "Invalid OTP or login failed.", true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4 w-full">
      <InputField 
        type="tel" 
        placeholder="Enter your 10-digit phone number" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
        disabled={isLoading || otpSent} 
      />
      {otpSent && (
        <InputField 
          type="text" 
          placeholder="Enter 6-digit OTP" 
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={isLoading}
        />
      )}
      <SubmitButton disabled={isLoading}>
        {isLoading ? 'Processing...' : (otpSent ? 'Verify & Login' : 'Send OTP')}
      </SubmitButton>
    </form>
  );
}


// --- FORGOT PASSWORD MODAL & STEPS ---
// NOTE: This assumes you have a working Forgot Password API flow
function ForgotPasswordModal({ isOpen, onClose }) {
  // ... All the states and logic for the multi-step modal ...
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
      {/* ... The full modal content from previous steps ... */}
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-gray-900 border border-gray-700 rounded-xl">
        <h2 className="text-xl font-bold text-center">Forgot Password</h2>
        <p className="text-center text-gray-400 mt-4">Forgot Password functionality is not connected in this example.</p>
        <button onClick={onClose} className="w-full mt-6 py-2 bg-blue-600 rounded-full">Close</button>
      </div>
    </div>
  );
}