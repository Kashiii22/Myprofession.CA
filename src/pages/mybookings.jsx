"use client";
import { useState, useEffect } from "react";
import BookingCard from "@/components/BookingCard";
import Sidebar from "@/components/Sidebar";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "@/components/Header";

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

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const filteredBookings = dummyBookings.filter(
    (b) =>
      b.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-950 to-black text-white">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 mt-4">
          <h1 className="text-3xl font-extrabold mb-6 text-blue-400 tracking-tight">
            📚 My Bookings
          </h1>

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
            <div className="flex flex-col gap-6">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No bookings found.</p>
          )}
        </main>
      </div>
    </>
  );
}
