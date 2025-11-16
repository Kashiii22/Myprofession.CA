"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import GoogleIcon from "./GoogleIcon";
import VerifyOtpModal from "./VerifyOtpModal";
import AuthModal from "./AuthModal";
import {
  toggleTab,
  setPhone,
  toggleOtpModal,
  setClosing,
  setLoginMethod,
} from "@/redux/authSlice";
import {
  signup,
  login,
  requestLoginOTP,
  verifyLoginOTP,
  verifyOtpAndCreateUser,
} from "@/lib/api/auth";

const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  disabled = false,
}) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded focus:outline-none focus:ring focus:ring-blue-400 disabled:opacity-50"
    autoComplete="off"
  />
);

const GoogleAuthButton = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Store that we're coming from consultant join flow for post-auth redirect
  const handleGoogleLogin = () => {
    // Set a flag in sessionStorage to check after Google auth completes
    sessionStorage.setItem('consultantJoinFlow', 'true');
    window.location.href = `${apiUrl}/api/v1/google`;
  };

  return (
    <div className="mt-6">
      <div className="flex items-center my-4">
        <div className="h-px bg-gray-600 flex-grow" />
        <span className="mx-3 text-gray-400 text-sm">or</span>
        <div className="h-px bg-gray-600 flex-grow" />
      </div>
      
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-medium px-4 py-2 rounded shadow hover:opacity-90 transition"
      >
        <GoogleIcon /> Sign up with Google
      </button>
    </div>
  );
};



export default function ConsultantJoinModal({ onClose, onLoginSuccess, key }) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { showLoginTab, closing, showOtpModal, loginMethod, user } = useSelector(
    (state) => state.auth
  );

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("login"); // login, redirecting
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    dispatch(setClosing(false));
    // Reset state when modal opens
    setStep("login");
    setShowAuthModal(false);
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(setPhone(formState.email));

    try {
      if (loginMethod === "otp") {
        const response = await requestLoginOTP({ email: formState.email });
        if (response.success) {
          toast.success(response.message);
          dispatch(toggleOtpModal(true));
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await login({
          email: formState.email,
          password: formState.password,
        });
        if (response.success) {
          toast.success(response.message);
          handleSuccess(response.user);
        } else {
          toast.error(response.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (formState.password !== formState.confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    setLoading(true);
    dispatch(setPhone(formState.email));
    try {
      const response = await signup({
        name: formState.name,
        email: formState.email,
        password: formState.password,
      });

      if (response.success) {
        toast.success(response.message);
        dispatch(toggleOtpModal(true));
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (otp) => {
    setLoading(true);
    try {
      if (showLoginTab) {
        const response = await verifyLoginOTP({ email: formState.email, otp });
        if (response.success) {
          toast.success(response.message);
          handleSuccess(response.user);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await verifyOtpAndCreateUser({
          email: formState.email,
          otp,
        });
        if (response.success) {
          toast.success(response.message);
          handleSuccess(response.user);
        } else {
          toast.error(response.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (closing) return;
    dispatch(setClosing(true));
    setTimeout(() => {
      setStep("login");
      setShowAuthModal(false);
      dispatch(setClosing(false)); // Reset closing state for next time
      onClose?.();
    }, 300);
  };

  const handleSuccess = (user) => {
    setStep("redirecting");
    if (closing) return;
    dispatch(setClosing(true));
    setTimeout(() => {
      onLoginSuccess?.(user);
      // Redirect to expert profile setup for consultants
      router.push('/expert-profile');
    }, 1500);
  };

  if (step === "redirecting") {
    return (
      <div
        className={`fixed inset-0 z-[55] bg-black/80 flex items-center justify-center px-4 transition-opacity duration-300`}
      >
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Redirecting to Consultant Setup...</h3>
          <p className="text-gray-400">Preparing your consultant profile</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <>
        <div
          className={`fixed inset-0 z-[55] bg-black/70 flex items-center justify-center px-4 transition-opacity duration-300 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md bg-[#0e1625]/80 border border-blue-800 ring-1 ring-blue-500/30 shadow-[0_0_60px_#1e3a8acc] rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 transform ${
              closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-full px-6 py-8 relative">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Join as a Consultant</h2>
                <p className="text-gray-400 text-sm">Start your journey as a mentor today</p>
              </div>

              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 mb-4"
              >
                Login/Signup First
              </button>

              <p className="text-center text-gray-400 text-sm">
                New to our platform? You can create an account or login with your credentials
              </p>
            </div>
          </div>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 z-[60]">
            <AuthModal
              onClose={() => {
                setShowAuthModal(false);
                // Reset the state to allow reopening
                setStep("login");
                dispatch(setClosing(false)); // Force reset closing state
              }}
              onLoginSuccess={(user) => {
                setShowAuthModal(false);
                handleSuccess(user);
              }}
            />
          </div>
        )}
      </>
    );
  }

  // Logged in user - redirect to consultant setup
  return (
    <>
      <div
        className={`fixed inset-0 z-[55] bg-black/80 flex items-center justify-center px-4 transition-opacity duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-md bg-[#0e1625]/80 border border-blue-800 ring-1 ring-blue-500/30 shadow-[0_0_60px_#1e3a8acc] rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 transform ${
            closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <div className="w-full px-6 py-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-gray-400 text-sm mb-6">You're logged in. Setting up your consultant profile...</p>
            
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    </>
  );
}
