"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { removeSlot } from "../../redux/availabilitySlice";
import AddSlotForm from "../../components/AddSlotForm";
import { toast } from "react-hot-toast";
import {
  FaCalendarDay,
  FaClock,
  FaVideo,
  FaTrash,
  FaRupeeSign,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";

export default function MentorAvailability() {
  const { slots } = useSelector((state) => state.availability);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated and is a mentor
    if (isAuthenticated === false && (!user || !user.role)) {
      toast.error("Please login to access availability page.");
      router.push("/");
      return;
    }
    
    if (isAuthenticated && user && user.role !== "MENTOR") {
      toast.error("Access denied. Mentor access required.");
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Return loading state while checking authentication
  if (isAuthenticated === false && (!user || !user.role || user.role !== "MENTOR")) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Return loading if auth is still being determined
  if (isAuthenticated !== true || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black text-white font-sans min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-purple-900/40 border border-blue-700/50 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-300 flex items-center gap-2">
              <FaCalendarDay className="text-blue-400" />
              Manage Availability
            </h1>
            <p className="text-base sm:text-lg text-gray-400">
              Set your weekly availability sessions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => router.push("/mentor/dashboard")}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Add Slot Form */}
        <section className="mb-12">
          <AddSlotForm />
        </section>

        {/* Availability Cards */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Your Available Slots</h2>
          {slots.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              You haven't added any availability slots yet.
            </p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map((slot, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative bg-[#1f2937] p-6 rounded-2xl shadow-md border border-gray-700 hover:shadow-blue-500/20 transition-all"
                >
                  {/* Day */}
                  <div className="flex items-center mb-3 gap-2 text-blue-400">
                    <FaCalendarDay />
                    <span className="text-lg font-semibold">{slot.day}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center mb-3 gap-2 text-gray-300">
                    <FaClock />
                    <span className="text-md">{slot.time}</span>
                  </div>

                  {/* Platform */}
                  <div className="flex items-center mb-3 gap-2 text-green-400">
                    <FaVideo />
                    <span className="text-md">Video Session</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-3 gap-2 text-gray-200">
                    <FaRupeeSign />
                    <span className="text-md">₹500</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center mb-3 gap-2 text-blue-300">
                    <span className="text-md font-medium">Status:</span>
                    <span className="bg-blue-900 px-2 py-1 rounded-full text-sm">
                      Available
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => dispatch(removeSlot(index))}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition"
                    aria-label="Delete slot"
                    title="Delete Slot"
                  >
                    <FaTrash />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
