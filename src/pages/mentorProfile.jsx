"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import {
FaStar,
FaStarHalfAlt,
FaRegStar,
FaTwitter,
FaLinkedin,
FaGlobe,
FaRegClock,
FaCalendarAlt,
FaChartLine,
} from "react-icons/fa";
import Header from "@/components/Header";
import ScheduleSessionModal from "@/components/ScheduleSessionModal";

const mentor = {
name: "CA Rohan Mehta",
title: "Direct Tax Expert",
image: "/mentors/rohan.png",
rating: 4.8,
pricePerMinute: 30,
location: "Delhi, India",
expertise: ["Direct Tax", "Income Tax", "Capital Gains"],
quote: "Taxation is not just compliance, it's strategy.",
experience: "10+ years of consulting & mentoring students",
qualifications: ["CA", "LLB", "Registered Tax Practitioner"],
about:
"With over a decade of experience in taxation, I’ve mentored hundreds of students and professionals. My sessions are practical, case-based, and focused on simplifying complex tax concepts. I aim to simplify law and taxation for young learners and professionals, making it both impactful and applicable. My approach is client-first, backed by legal accuracy and strategic insight.",
socials: {
twitter: "https://twitter.com",
linkedin: "https://linkedin.com",
website: "https://example.com",
},
stats: {
sessionsCompleted: 340,
totalMinutes: 1780,
rating: 4.8,
},
};

const RenderStars = ({ rating }) => {
const stars = [];
for (let i = 1; i <= 5; i++) {
if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
else if (rating >= i - 0.5)
stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
}
return <div className="flex gap-1 mt-2 justify-center">{stars}</div>;
};

export default function MentorProfile() {
const [showModal, setShowModal] = useState(false);
const [selectedDate, setSelectedDate] = useState(null);
const [selectedMode, setSelectedMode] = useState("video");
const [selectedDuration, setSelectedDuration] = useState("15");

useEffect(() => {
AOS.init({ duration: 1000, once: true });
}, []);

return (
<div className="bg-gradient-to-br from-black to-gray-900 text-white min-h-screen">
<Header />
  <section className="px-6 md:px-20 py-12 space-y-16 max-w-screen-xl mx-auto">
    {/* Mentor Header */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
      <div className="lg:col-span-2 flex flex-col items-center text-center lg:text-left">
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500">
          <Image src={mentor.image} alt={mentor.name} fill className="object-cover" />
        </div>
        <RenderStars rating={mentor.rating} />
        <p className="text-sm mt-1 text-gray-400">Rated {mentor.rating} / 5</p>
        <div className="flex gap-3 mt-4 text-xl text-blue-400">
          <a href={mentor.socials.twitter} target="_blank"><FaTwitter /></a>
          <a href={mentor.socials.linkedin} target="_blank"><FaLinkedin /></a>
          <a href={mentor.socials.website} target="_blank"><FaGlobe /></a>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-3">
        <h1 className="text-4xl font-bold">{mentor.name}</h1>
        <p className="text-lg text-blue-400">{mentor.title}</p>
        <p className="text-sm text-gray-400">{mentor.location}</p>
        <blockquote className="text-sm italic text-blue-300 border-l-4 border-blue-600 pl-4 mt-3">
          “{mentor.quote}”
        </blockquote>
        <p className="text-sm text-blue-100">{mentor.experience}</p>
        <div className="flex gap-3 mt-4">
          <button className="bg-blue-600 px-6 py-2 rounded-full text-white shadow">
            Connect
          </button>
          <button
            className="border border-blue-600 text-blue-400 px-5 py-2 rounded-full hover:bg-blue-800/20"
            onClick={() => setShowModal(true)}
          >
            Schedule Session
          </button>
        </div>
      </div>
    </div>

    {/* Community Stats */}
    {/* Community Stats */}
<div className="mt-10 space-y-4 bg-[#0e1a2b] border border-blue-800 rounded-xl p-6 shadow-lg">
  <div className="flex items-center gap-2 text-blue-400 text-lg font-semibold">
    <FaChartLine className="text-blue-500" />
    <h3>Community Stats</h3>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
    <div className="flex items-center bg-blue-900 p-4 rounded-lg gap-3 border border-blue-500">
      <FaRegClock className="text-white text-2xl" />
      <div>
        <p className="text-sm text-gray-300">Minutes Mentored</p>
        <p className="font-bold text-blue-100">{mentor.stats.totalMinutes}</p>
      </div>
    </div>

    <div className="flex items-center bg-green-900 p-4 rounded-lg gap-3 border border-green-500">
      <FaCalendarAlt className="text-white text-2xl" />
      <div>
        <p className="text-sm text-gray-300">Sessions Completed</p>
        <p className="font-bold text-green-100">{mentor.stats.sessionsCompleted}</p>
      </div>
    </div>

    <div className="flex items-center bg-yellow-800 p-4 rounded-lg gap-3 border border-yellow-500">
      <FaStar className="text-white text-2xl" />
      <div>
        <p className="text-sm text-gray-300">Rating</p>
        <p className="font-bold text-yellow-100">{mentor.stats.rating} / 5</p>
      </div>
    </div>
  </div>
</div>

  </section>

  {/* Modal */}
  {showModal && (
    <ScheduleSessionModal
      onClose={() => setShowModal(false)}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      selectedMode={selectedMode}
      setSelectedMode={setSelectedMode}
      selectedDuration={selectedDuration}
      setSelectedDuration={setSelectedDuration}
      pricePerMinute={mentor.pricePerMinute}
    />
  )}
</div>
);
}