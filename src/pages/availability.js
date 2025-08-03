"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeSlot } from "../redux/availabilitySlice";
import AddSlotForm from "../components/AddSlotForm";
import {
  FaCalendarDay,
  FaClock,
  FaVideo,
  FaTrash,
  FaRupeeSign,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function Availability() {
  const { slots } = useSelector((state) => state.availability);
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Header />

      {/* Main Container */}
      <div className="min-h-screen bg-black text-white flex flex-col md:flex-row transition-all relative">
        {/* Sidebar */}
        <Sidebar sidebarOpen={showSidebar} setSidebarOpen={setShowSidebar} />

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 md:p-10">
          {/* Heading */}
          <section className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
              Weekly <span className="text-blue-500">Availability</span>
            </h2>
            <p className="text-gray-400 text-base">
              Keep your calendar updated to ensure clients can book confidently.
            </p>
          </section>

          {/* Add Slot Form */}
          <section className="mb-12">
            <AddSlotForm />
          </section>

          {/* Availability Cards */}
          <section>
            {slots.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">
                You haven’t added any availability slots yet.
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

      <Footer />
    </>
  );
}
