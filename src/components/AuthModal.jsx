"use client";

// ✅ 1. Import useEffect from React
import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import GoogleIcon from "./GoogleIcon";
import VerifyOtpModal from "./VerifyOtpModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import {
  toggleTab,
  setPhone,
  toggleOtpModal,
  setClosing, // This is the action we need to dispatch
  setLoginMethod,
} from "@/redux/authSlice";
import {
  signup,
  login,
  requestLoginOTP,
  verifyLoginOTP,
  verifyOtpAndCreateUser,
} from "@/lib/api/auth";

// Input Field (No changes)
const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  name,
}) => (
  <input
    type={type}
    name={name}
    inputMode={type === "tel" ? "numeric" : undefined}
    pattern={type === "tel" ? "[0-9]*" : undefined}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    maxLength={type === "tel" ? 10 : undefined}
    className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded focus:outline-none focus:ring focus:ring-blue-400"
    autoComplete="off"
  />
);

// Google Auth Button (No changes)
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

// IT Laws Panel (No changes)
const ITLawsPanel = () => (
  <div className="hidden md:flex md:w-1/2 flex-col justify-center items-start p-6 lg:p-10 text-left">
    <Image
      src="/Illustration2.png"
      alt="Illustration"
      width={320}
      height={320}
      className="object-contain mb-4"
    />
    <h2 className="text-lg lg:text-xl font-semibold text-blue-300 px-4 leading-snug mb-2">
      Learn & Grow Safely
    </h2>
    <p className="text-gray-400 text-sm px-4">
      Our platform follows IT laws. Users must provide accurate info and respect
      privacy, copyright, and secure authentication rules.
    </p>
  </div>
);

// Main Modal
export default function AuthModal({ onClose, onLoginSuccess }) {
  const dispatch = useDispatch();
  const { isLogin, closing, showOtpModal, loginMethod } = useSelector(
    (state) => state.auth
  );

  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // ✅ 2. THIS IS THE FIX:
  // Reset the 'closing' state every time the modal mounts.
  // This ensures that if the modal was closed previously (setting closing=true),
  // it doesn't re-mount as invisible.
  useEffect(() => {
    dispatch(setClosing(false));
  }, [dispatch]); // Add dispatch to dependency array

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setFormState((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(setPhone(formState.phone));
    const phoneWithPrefix = `+91${formState.phone}`;

    try {
      if (loginMethod === "otp") {
        const response = await requestLoginOTP({ phone: phoneWithPrefix });
        console.log(response);
        if (response.success) {
          toast.success(response.message);
          dispatch(toggleOtpModal(true));
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await login({
          phone: phoneWithPrefix,
          password: formState.password,
        });
        if (response.success) {
          toast.success(response.message);
          console.log("Logged in user:", response.user);
          handleSuccess();
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
    dispatch(setPhone(formState.phone));
    const phoneWithPrefix = `+91${formState.phone}`;
    try {
      const response = await signup({
        name: formState.name,
        phone: phoneWithPrefix,
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
    const phoneWithPrefix = `+91${formState.phone}`;
    try {
      if (isLogin) {
        const response = await verifyLoginOTP({ phone: phoneWithPrefix, otp });
        if (response.success) {
          toast.success(response.message);
          console.log("Logged in user:", response.user);
          handleSuccess();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await verifyOtpAndCreateUser({
          phone: phoneWithPrefix,
          otp,
        });
        if (response.success) {
          toast.success(response.message);
          dispatch(toggleOtpModal(false));
          dispatch(toggleTab()); // Switch to login tab after successful signup
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

  // This function is for CANCEL / CLOSE
  const handleClose = () => {
    if (closing) return;
    dispatch(setClosing(true));
    setTimeout(() => onClose?.(), 300);
  };

  // This function is for SUCCESSFUL LOGIN
  const handleSuccess = () => {
    if (closing) return;
    dispatch(setClosing(true));
    setTimeout(() => onLoginSuccess?.(), 300);
  };

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
            phone={formState.phone}
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
          <ITLawsPanel />

          <div className="w-full md:w-1/2 text-white flex flex-col justify-center items-center">
            <div className="w-full px-4 py-6 sm:px-6 md:px-10 lg:px-12 relative min-h-[550px] overflow-y-auto max-h-screen">
              <div className="flex justify-center mb-6 bg-[#1c2938] rounded-full overflow-hidden w-full max-w-xs mx-auto">
                {["Login", "Signup"].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => dispatch(toggleTab())}
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

              <div className="space-y-4 w-full max-w-md mx-auto">
                {isLogin ? (
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
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formState.phone}
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
                      className="w-full mt-2 bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-9NORMAL_TEXTtext-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      {loading
                        ? "Processing..."
                        : loginMethod === "otp"
                        ? "Send OTP"
                        : "Login"}
                    </button>

                    <p
                      className="text-sm text-right text-blue-500 mt-2 cursor-pointer hover:underline"
                      onClick={() => setShowForgotModal(true)}
                    >
                      Forgot Password?
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
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formState.phone}
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
                      {loading ? "Processing..." : "Signup"}
                    </button>
                  </form>
                )}

                <GoogleAuthButton />

                <p className="text-sm text-center text-gray-400 mt-4">
                  {isLogin ? "Not a member?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => dispatch(toggleTab())}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    {isLogin ? "Signup now" : "Login"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </>
  );
}