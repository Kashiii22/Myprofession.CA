"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import GoogleIcon from "./GoogleIcon";
import VerifyOtpModal from "./VerifyOtpModal";
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

const ConsultantBenefits = () => (
  <div className="hidden md:flex md:w-1/2 flex-col justify-center items-start p-6 lg:p-10 text-left bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
    <div className="mb-8">
      <h2 className="text-xl lg:text-2xl font-bold text-white mb-4">
        Share Your Expertise as a Consultant
      </h2>
      <p className="text-gray-300 text-sm leading-relaxed mb-6">
        Join our community of skilled Chartered Accountants and help guide the next 
        generation of professionals while earning additional income.
      </p>
    </div>
    
    <div className="space-y-4">
      {[
        { icon: "💰", title: "Earn Additional Income", desc: "Monetize your expertise through consultations" },
        { icon: "🌱", title: "Flexible Schedule", desc: "Set your own availability and work hours" },
        { icon: "👥", title: "Build Your Network", desc: "Connect with aspiring professionals" },
        { icon: "📚", title: "Share Knowledge", desc: "Help others navigate their career journey" },
      ].map((benefit, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="text-2xl">{benefit.icon}</span>
          <div>
            <h3 className="text-white font-semibold text-sm">{benefit.title}</h3>
            <p className="text-gray-400 text-xs">{benefit.desc}</p>
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-8 p-4 border border-blue-500/30 rounded-lg bg-blue-900/20">
      <p className="text-blue-300 text-sm font-medium mb-1">Already a member?</p>
      <p className="text-gray-400 text-xs">
        Log in to access your consultant dashboard and manage your profile.
      </p>
    </div>
  </div>
);

export default function ConsultantJoinModal({ onClose, onLoginSuccess }) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { showLoginTab, closing, showOtpModal, loginMethod } = useSelector(
    (state) => state.auth
  );

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("auth"); // auth, redirecting

  useEffect(() => {
    dispatch(setClosing(false));
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
    setTimeout(() => onClose?.(), 300);
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
        className={`fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4 transition-opacity duration-300`}
      >
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Redirecting to Consultant Setup...</h3>
          <p className="text-gray-400">Preparing your consultant profile</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 transition-opacity duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      >
        {showOtpModal && (
          <VerifyOtpModal
            phone={formState.email}
            onClose={() => dispatch(toggleOtpModal(false))}
            onVerify={handleOtpVerification}
            loading={loading}
          />
        )}

        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-md md:max-w-5xl bg-[#0e1625]/80 border border-blue-800 ring-1 ring-blue-500/30 shadow-[0_0_60px_#1e3a8acc] rounded-none md:rounded-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-xl transition-all duration-300 transform ${
            closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <ConsultantBenefits />

          <div className="w-full md:w-1/2 text-white flex flex-col justify-center items-center">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-full px-4 py-6 sm:px-6 md:px-10 lg:px-12 relative min-h-[550px] overflow-y-auto max-h-screen">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Join as a Consultant</h2>
                <p className="text-gray-400 text-sm">Start your journey as a mentor today</p>
              </div>

              <div className="flex justify-center mb-6 bg-[#1c2938] rounded-full overflow-hidden w-full max-w-xs mx-auto">
                {["Login", "Signup"].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => dispatch(toggleTab())}
                    className={`px-6 py-2 font-semibold text-sm w-full transition-all ${
                      showLoginTab === (i === 0)
                        ? "bg-blue-600 text-white"
                        : "text-gray-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-4 w-full max-w-md mx-auto">
                {showLoginTab ? (
                  <form
                    onSubmit={handleLoginSubmit}
                    autoComplete="off"
                    className="space-y-4"
                  >
                    <div className="flex justify-center space-x-4">
                      {["otp", "password"].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => dispatch(setLoginMethod(method))}
                          className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                            loginMethod === method
                              ? "bg-blue-600 text-white"
                              : "bg-[#1c2938] text-gray-400"
                          }`}
                        >
                          {method.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <InputField
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formState.email}
                      onChange={handleInputChange}
                    />

                    {loginMethod === "password" && (
                      <InputField
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formState.password}
                        onChange={handleInputChange}
                      />
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      {loading
                        ? "Processing..."
                        : loginMethod === "otp"
                        ? "Send OTP"
                        : "Login"}
                    </button>

                    <p className="text-xs text-center text-gray-500">
                      After login, you'll be redirected to setup your consultant profile
                    </p>
                  </form>
                ) : (
                  <form
                    onSubmit={handleSignupSubmit}
                    className="space-y-4 w-full"
                  >
                    <InputField
                      name="name"
                      placeholder="Full Name"
                      value={formState.name}
                      onChange={handleInputChange}
                    />
                    <InputField
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formState.email}
                      onChange={handleInputChange}
                    />
                    <InputField
                      type="password"
                      name="password"
                      placeholder="Create Password"
                      value={formState.password}
                      onChange={handleInputChange}
                    />
                    <InputField
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formState.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Create Account"}
                    </button>
                  </form>
                )}

                <GoogleAuthButton />

                <p className="text-sm text-center text-gray-400 mt-4">
                  {showLoginTab ? "New to our platform?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => dispatch(toggleTab())}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    {showLoginTab ? "Create account" : "Login"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
