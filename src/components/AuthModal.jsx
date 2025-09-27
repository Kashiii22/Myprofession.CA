"use client";

import Image from "next/image";
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

// Input Field
const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
}) => (
  <input
    type={type}
    inputMode={type === "tel" ? "numeric" : undefined}
    pattern={type === "tel" ? "[0-9]*" : undefined}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    maxLength={type === "tel" ? 10 : undefined}
    className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded focus:outline-none focus:ring focus:ring-blue-400"
  />
);

// Google Auth Button
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

// IT Laws Description Panel
const ITLawsPanel = () => (
  <div className="hidden md:flex md:w-1/2 flex-col justify-center items-start p-6 lg:p-10 text-left">
    <Image
      src="/illustration2.png"
      alt="Illustration"
      width={320}
      height={320}
      className="object-contain mb-4"
    />
    <h2 className="text-lg lg:text-xl font-semibold text-blue-300 px-4 leading-snug mb-2">
      Learn & Grow Safely
    </h2>
    <p className="text-gray-400 text-sm px-4">
      Our platform follows IT laws. Users must provide accurate info and respect privacy, copyright, and secure authentication rules.
    </p>
  </div>
);

// Main Modal
export default function AuthModal({ onClose }) {
  const dispatch = useDispatch();
  const { isLogin, phone, closing, showOtpModal, loginMethod } = useSelector(
    (state) => state.auth
  );

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      toast.success("OTP sent successfully!");
      dispatch(toggleOtpModal(true));
    } else {
      toast.error("Please enter a valid 10-digit phone number.");
    }
  };

  const handleClose = () => {
    if (closing) return;
    dispatch(setClosing(true));
    setTimeout(() => onClose?.(), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 transition-opacity duration-300 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      {showOtpModal && (
        <VerifyOtpModal
          phone={phone}
          onClose={() => dispatch(toggleOtpModal(false))}
        />
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md md:max-w-5xl bg-[#0e1625]/80 border border-blue-800 ring-1 ring-blue-500/30 shadow-[0_0_60px_#1e3a8acc] rounded-none md:rounded-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-xl transition-all duration-300 transform ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Left Panel with IT Laws */}
        <ITLawsPanel />

        {/* Right Panel */}
        <div className="w-full md:w-1/2 text-white flex flex-col justify-center items-center">
          <div className="w-full px-4 py-6 sm:px-6 md:px-10 lg:px-12 relative min-h-[550px] overflow-y-auto max-h-screen">
            {/* Toggle Tabs */}
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

            {/* Forms */}
            <div className="space-y-4 w-full max-w-md mx-auto">
              {isLogin ? (
                <form
                  onSubmit={handleSendOtp}
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
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (/^\d{0,10}$/.test(raw)) dispatch(setPhone(raw));
                    }}
                    onBlur={() => dispatch(setPhone(phone.replace(/\D/g, "")))}
                  />

                  {loginMethod === "password" && (
                    <InputField type="password" placeholder="Password" />
                  )}

                  <button
                    type="submit"
                    className="w-full mt-2 bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition"
                  >
                    {loginMethod === "otp" ? "Send OTP" : "Login"}
                  </button>

                  <p className="text-sm text-right text-blue-500 mt-2 cursor-pointer hover:underline">
                    Forgot Password?
                  </p>
                </form>
              ) : (
                <form className="space-y-4 w-full">
                  <InputField placeholder="Full Name" />
                  <InputField
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (/^\d{0,10}$/.test(raw)) dispatch(setPhone(raw));
                    }}
                    onBlur={() => dispatch(setPhone(phone.replace(/\D/g, "")))}
                  />
                  <InputField type="password" placeholder="Create Password" />
                  <InputField type="password" placeholder="Confirm Password" />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Signup
                  </button>
                </form>
              )}

              {/* Google Button */}
              <GoogleAuthButton />

              {/* Switch Prompt */}
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
  );
}
