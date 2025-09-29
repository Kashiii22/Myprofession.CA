"use client";

import { useEffect, useState, memo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import {
  FaStar, FaStarHalfAlt, FaRegStar,
  FaTwitter, FaLinkedin, FaGlobe,
  FaRegClock, FaCalendarAlt, FaChartLine
} from "react-icons/fa";

import Header from "@/components/Header";
import ScheduleSessionModal from "@/components/ScheduleSessionModal";
import Footer from "@/components/Footer";

const mentor = {
  name: "CA Rohan Mehta",
  title: "Direct Tax Expert",
  image: "https://i.pravatar.cc/150?img=12",
  rating: 4.8,
  pricePerMinute: 30,
  location: "Delhi, India",
  expertise: ["Direct Tax", "Income Tax", "Capital Gains"],
  experience: "10+ years of consulting & mentoring students",
  qualifications: ["CA", "LLB", "Registered Tax Practitioner"],
  about: `With over a decade of experience in taxation, I’ve mentored hundreds of students and professionals. My sessions are practical, case-based, and focused on simplifying complex tax concepts. I aim to simplify law and taxation for young learners and professionals, making it both impactful and applicable. My approach is client-first, backed by legal accuracy and strategic insight.`,
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

const RenderStars = memo(({ rating }) => (
  <div className="flex gap-2 mt-3 justify-center text-2xl sm:text-3xl">
    {Array.from({ length: 5 }, (_, i) => {
      const value = i + 1;
      if (rating >= value) return <FaStar key={value} className="text-yellow-400" />;
      if (rating >= value - 0.5) return <FaStarHalfAlt key={value} className="text-yellow-400" />;
      return <FaRegStar key={value} className="text-yellow-400" />;
    })}
  </div>
));

export default function MentorProfile() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMode, setSelectedMode] = useState("video");
  const [selectedDuration, setSelectedDuration] = useState("15");
  const [newReview, setNewReview] = useState("");
  const [reviews, setReviews] = useState([
    "Amazing clarity in tax concepts. Very helpful and friendly.",
    "Great mentor. Helped me crack my exam doubts in minutes.",
  ]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const SocialLinks = () => (
    <div className="flex flex-wrap gap-5 mt-4 justify-center lg:justify-start text-3xl text-blue-400">
      <a href={mentor.socials.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
      <a href={mentor.socials.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
      <a href={mentor.socials.website} target="_blank" rel="noopener noreferrer"><FaGlobe /></a>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, bg, border, text }) => (
    <div className={`flex items-center ${bg} p-5 rounded-xl gap-4 border ${border} w-full`}>
      <Icon className="text-white text-4xl shrink-0" />
      <div className="overflow-hidden">
        <p className="text-lg sm:text-xl text-gray-300 truncate">{label}</p>
        <p className={`font-bold text-xl sm:text-2xl ${text}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen text-[18px] sm:text-[20px] font-['Outfit']">
      <Header />
      <section className="px-6 sm:px-8 md:px-14 lg:px-24 py-14 space-y-14 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 flex flex-col items-center text-center lg:text-left">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-blue-500">
              <Image src={mentor.image} alt={mentor.name} fill className="object-cover" />
            </div>
            <RenderStars rating={mentor.rating} />
            <p className="text-gray-400 mt-2 text-lg">Rated {mentor.rating} / 5</p>
            <SocialLinks />
          </div>

          <div className="lg:col-span-3 space-y-5 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold">{mentor.name}</h1>
            <p className="text-2xl sm:text-3xl text-blue-400">{mentor.title}</p>
            <p className="text-lg sm:text-xl text-gray-400">{mentor.location}</p>
            <p className="text-lg sm:text-xl text-blue-100">{mentor.experience}</p>

            <div className="bg-gray-800 p-5 mt-5 rounded-xl">
              <h3 className="text-blue-300 font-semibold mb-2 text-xl">Specializations</h3>
              <ul className="list-disc list-inside text-gray-200 space-y-2 text-lg sm:text-xl">
                {mentor.expertise.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-center lg:justify-start">
              <button
                className="border border-blue-600 text-blue-400 px-8 py-4 rounded-full hover:bg-blue-800/20 text-lg sm:text-xl font-medium"
                onClick={() => setShowModal(true)}
              >
                Schedule Session
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8" data-aos="fade-right">
            <div className="bg-[#0f172a] p-8 rounded-2xl border border-gray-700 shadow-lg">
              <h2 className="text-3xl sm:text-4xl font-semibold text-blue-400 mb-3">About</h2>
              <p className="text-gray-300 leading-relaxed text-lg sm:text-xl">{mentor.about}</p>
            </div>

            <div className="bg-[#0f172a] p-8 rounded-2xl border border-gray-700 shadow-lg space-y-6">
              <h2 className="text-3xl sm:text-4xl font-semibold text-blue-400">Reviews</h2>
              <div className="space-y-5">
                {reviews.map((review, idx) => (
                  <div key={idx} className="bg-gray-800 p-5 rounded-xl">
                    <p className="text-gray-200 text-lg sm:text-xl">“{review}”</p>
                    <p className="text-sm sm:text-base text-gray-500 mt-2">– Anonymous</p>
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-gray-600">
                <h3 className="text-xl sm:text-2xl font-medium text-blue-300 mb-3">Add a Review</h3>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full p-4 text-lg sm:text-xl bg-gray-800 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <button
                  onClick={() => {
                    if (newReview.trim()) {
                      setReviews((prev) => [...prev, newReview]);
                      setNewReview("");
                    }
                  }}
                  className="mt-4 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-lg sm:text-xl font-medium"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8" data-aos="fade-left">
            <div className="bg-[#0e1a2b] border border-blue-800 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-3 text-blue-400 text-2xl sm:text-3xl font-semibold mb-5">
                <FaChartLine className="text-blue-500" />
                <h3>Community Stats</h3>
              </div>
              <div className="grid gap-5 md:grid-cols-1 lg:grid-cols-1">
                <StatCard
                  icon={FaRegClock}
                  label="Minutes Mentored"
                  value={mentor.stats.totalMinutes}
                  bg="bg-blue-900"
                  border="border-blue-500"
                  text="text-blue-100"
                />
                <StatCard
                  icon={FaCalendarAlt}
                  label="Sessions Completed"
                  value={mentor.stats.sessionsCompleted}
                  bg="bg-green-900"
                  border="border-green-500"
                  text="text-green-100"
                />
                <StatCard
                  icon={FaStar}
                  label="Rating"
                  value={`${mentor.stats.rating} / 5`}
                  bg="bg-yellow-800"
                  border="border-yellow-500"
                  text="text-yellow-100"
                />
              </div>
            </div>
          </div>
        </div>

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
      </section>
      <Footer />
    </div>
  );
}
