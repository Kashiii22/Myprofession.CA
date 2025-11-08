"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaRupeeSign } from "react-icons/fa";
import { toast } from "react-hot-toast";

// ✅ Import your Redux user and actions
import { useSelector, useDispatch } from "react-redux";
import { setLoginSuccess } from "@/redux/authSlice";

// ✅ Import your API function for creating a payment order
// You will need to create this API file.
// import { createPaymentOrder } from "@/lib/api/payment";

// --- (This is a MOCK API call. Replace with your real one) ---
// This function simulates creating an order on your backend.
const createPaymentOrder = async (amount) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        orderId: `order_${Math.random().toString(36).substring(2, 15)}`,
        amount: amount * 100, // Razorpay expects amount in paise
      });
    }, 1000);
  });
};

// --- (This is a MOCK payment success call. Replace with your real one) ---
// This function simulates verifying the payment on your backend.
const verifyPaymentAndUpdateWallet = async (paymentDetails) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, your backend would return the *new* user object
      // with the updated wallet balance.
      const updatedBalance = (paymentDetails.currentBalance || 0) + paymentDetails.amount;
      resolve({
        success: true,
        message: "Payment successful! Wallet updated.",
        user: { 
          ...paymentDetails.user, // Pass the original user
          walletBalance: updatedBalance // Set the new balance
        },
      });
    }, 1500);
  });
};
// --- (End of MOCK functions) ---


export default function RechargeModal({ onClose, onRechargeSuccess }) {
  const [closing, setClosing] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Get the current user from Redux
  const { user } = useSelector((state) => state.auth);

  // Quick add amounts
  const quickAmounts = [100, 500, 1000, 2000];

  // Handle the modal close animation
  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Animation duration
  };

  // Handle the "Proceed to Pay" button click
  const handleProceedToPay = async () => {
    const numericAmount = parseInt(amount, 10);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating payment order...");

    try {
      // ------------------------------------------------------------------
      // ✅ 1. YOUR BACKEND: Create a payment order (e.g., Razorpay Order)
      // ------------------------------------------------------------------
      // Your backend API should create an order with the payment gateway
      // and return an `orderId` and other details.
      const orderResponse = await createPaymentOrder(numericAmount);

      if (!orderResponse.success) {
        throw new Error("Could not create payment order.");
      }
      
      toast.dismiss(toastId);
      
      // ------------------------------------------------------------------
      // ✅ 2. YOUR FRONTEND: Open the Payment Gateway Modal (e.g., Razorpay Checkout)
      // ------------------------------------------------------------------
      // This is a MOCK. You must replace this with the *real*
      // Razorpay checkout script.
      const paymentSuccess = await openRazorpayMock(orderResponse.amount);

      if (!paymentSuccess) {
        throw new Error("Payment was cancelled or failed.");
      }

      // ------------------------------------------------------------------
      // ✅ 3. YOUR BACKEND: Verify payment and update wallet
      // ------------------------------------------------------------------
      toast.loading("Verifying payment and updating wallet...", { id: toastId });
      
      const verificationResponse = await verifyPaymentAndUpdateWallet({
        orderId: orderResponse.orderId,
        amount: numericAmount,
        currentBalance: user.walletBalance,
        user: user // Pass the full user object
        // Add razorpay_payment_id, razorpay_signature, etc. here
      });

      if (verificationResponse.success) {
        toast.dismiss(toastId);
        toast.success(verificationResponse.message);
        
        // Call the 'onRechargeSuccess' prop from Header.js
        // This will update Redux and close the modal.
        onRechargeSuccess(verificationResponse.user); 
      } else {
        throw new Error("Payment verification failed.");
      }

    } catch (error) {
      setLoading(false);
      toast.dismiss(toastId);
      toast.error(error.message || "An error occurred during payment.");
    }
  };

  // This is a MOCK payment modal. Replace with your actual Razorpay code.
  const openRazorpayMock = (amountInPaise) => {
    return new Promise((resolve) => {
      // Simulate the Razorpay "modal"
      if (window.confirm(`Do you want to pay ₹${amountInPaise / 100}?`)) {
        // User "paid"
        resolve({
          success: true,
          paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`,
        });
      } else {
        // User "cancelled"
        resolve(null);
      }
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 transition-opacity duration-300 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md bg-[#0e1625]/90 border border-blue-800 ring-1 ring-blue-500/30 shadow-[0_0_60px_#1e3a8acc] rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 transform text-white ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* --- Header --- */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Recharge Your Wallet
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* --- Body --- */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaRupeeSign className="text-gray-400" />
            </span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-[#1a2535] border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* --- Quick Add --- */}
          <div className="flex justify-between items-center mt-4 space-x-2">
            {quickAmounts.map((qAmount) => (
              <button
                key={qAmount}
                onClick={() => setAmount(String(qAmount))}
                className="flex-1 px-2 py-2 text-sm font-medium bg-[#1c2938] text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition"
              >
                ₹{qAmount}
              </button>
            ))}
          </div>

          {/* --- Action Button --- */}
          <button
            onClick={handleProceedToPay}
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-800 to-blue-600 hover:opacity-90 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : `Proceed to Add ₹${amount || 0}`}
          </button>
        </div>
      </div>
    </div>
  );
}