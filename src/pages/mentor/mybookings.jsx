"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import BookingCard from "@/components/BookingCard";
import Sidebar from "@/components/Sidebar";
import AOS from "aos";
import "aos/dist/aos.css";

const dummyBookings = [
  {
    id: 1,
    mentorName: "CA Ramesh Singh",
    subject: "GST Filing",
    dateTime: "Jul 20, 2025 at 5:00 PM",
    duration: "1 hour",
    mode: "Online (Google Meet)",
    status: "upcoming",
    mentorImage: "/placeholder.png",
  },
  {
    id: 2,
    mentorName: "CA Meena Kumari",
    subject: "Tax Audit",
    dateTime: "Jul 10, 2025 at 11:00 AM",
    duration: "45 minutes",
    mode: "Online (Google Meet)",
    status: "completed",
    mentorImage: "/placeholder.png",
  },
  {
    id: 3,
    mentorName: "CA Arvind",
    subject: "Investment Planning",
    dateTime: "Jul 5, 2025 at 3:00 PM",
    duration: "1 hour",
    mode: "Online (Zoom)",
    status: "cancelled",
    mentorImage: "/placeholder.png",
  },
];

export default function MyBookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    AOS.init({ duration: 800 });
    
    // Check if user is authenticated and is a mentor
    if (!isAuthenticated || !user?.role || user.role !== "MENTOR") {
      toast.error("Access denied. Mentor access required.");
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Return loading state while checking authentication
  if (!isAuthenticated || !user?.role || user.role !== "MENTOR") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  const filteredBookings = dummyBookings.filter(
    (b) =>
      b.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-950 to-black text-white">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-400 tracking-tight">
            📚 My Bookings
          </h1>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition text-sm"
          >
            ← Back to Website
          </button>
        </div>

        <div className="mb-8 max-w-md">
          <input
            type="text"
            placeholder="Search by mentor, subject or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#121c2e] border border-blue-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm placeholder:text-gray-400"
          />
        </div>
        {filteredBookings.length ? (
          <div className="flex flex-col gap-2">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No bookings found.</p>
        )}
      </main>
    </div>
  );
}
