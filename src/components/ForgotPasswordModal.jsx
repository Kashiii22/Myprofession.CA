"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setPhone, toggleOtpModal } from "@/redux/authSlice";
import VerifyOtpModal from "./VerifyOtpModal";
import {
  initiateForgotPassword,
  verifyOtpAndResetPassword,
} from "@/lib/api/auth";

// Input Field
const InputField = ({ type = "text", placeholder, value, onChange }) => (
  <input
    type={type}
    inputMode={type === "tel" ? "numeric" : undefined}
    pattern={type === "tel" ? "[0-9]*" : undefined}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    maxLength={type === "tel" ? 10 : undefined}
    className="w-full px-4 py-2 bg-[#1a2535] border border-blue-700 rounded focus:outline-none focus:ring focus:ring-blue-400"
  />
);

export default function ForgotPasswordModal({ onClose }) {
  const dispatch = useDispatch();
  const { phone, showOtpModal } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Step 1: Send OTP with updated response handling
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      return toast.error("Please enter a valid 10-digit phone number.");
    }
    setLoading(true);
    try {
      const response = await initiateForgotPassword({ phone: `+91${phone}` });
      if (response.success) {
        toast.success(response.message);
        dispatch(toggleOtpModal(true));
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Called after OTP is verified in the child modal
  const handleOtpVerified = (otp) => {
    dispatch(toggleOtpModal(false));
    setVerifiedOtp(otp); // Store the verified OTP
    setStep(2);
    toast.success("OTP Verified! You can reset your password now.");
  };

  // ✅ Step 2: Reset password with updated payload and response handling
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const response = await verifyOtpAndResetPassword({
        phone: `+91${phone}`,
        otp: verifiedOtp,
        newPassword: newPass, // Corrected payload key
      });
      if (response.success) {
        toast.success(response.message);
        onClose?.();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {showOtpModal && (
        <VerifyOtpModal
          phone={phone}
          onVerify={handleOtpVerified} // Pass verification handler
          onClose={() => dispatch(toggleOtpModal(false))}
          loading={loading}
        />
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#0e1625]/90 border border-blue-800 ring-1 ring-blue-500/30 shadow-[0_0_60px_#1e3a8acc] rounded-2xl overflow-hidden flex flex-col backdrop-blur-xl p-6"
      >
        <h2 className="text-xl text-white font-semibold mb-4 text-center">
          Forgot Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <InputField
              type="tel"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => {
                const raw = e.target.value;
                if (/^\d{0,10}$/.test(raw)) dispatch(setPhone(raw));
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <InputField
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <InputField
              type="password"
              placeholder="Confirm New Password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p
          onClick={onClose}
          className="text-sm text-blue-500 mt-4 cursor-pointer text-center hover:underline"
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}