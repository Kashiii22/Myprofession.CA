"use client";

import { useEffect, useState, memo } from "react";
import { useParams, useRouter } from 'next/navigation';
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import {
  FaStar, FaStarHalfAlt, FaRegStar,
  FaTwitter, FaLinkedin, FaGlobe,
  FaRegClock, FaCalendarAlt, FaChartLine,
  FaArrowLeft, FaCheckCircle, FaMoneyBillWave,
  FaLaptop, FaVideo, FaPhone, FaBrain,
  FaBriefcase, FaUniversity, FaCertificate
} from "react-icons/fa";

import Header from "@/components/Header";
import ScheduleSessionModal from "@/components/ScheduleSessionModal";
import Footer from "@/components/Footer";
import { getMentorById } from '@/lib/api/mentorApi'; // Assuming this is your API import

// --- Reusable Components (from new static template) ---

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

// This component is now local, driven by the `mentor` state variable
const SocialLinks = ({ socials }) => (
  <div className="flex flex-wrap gap-5 mt-4 justify-center lg:justify-start text-3xl text-blue-400">
    {socials.twitter && (
      <a href={socials.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
    )}
    {socials.linkedin && (
      <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
    )}
    {socials.website && (
      <a href={socials.website} target="_blank" rel="noopener noreferrer"><FaGlobe /></a>
    )}
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

// --- Main Page Component ---
export default function MentorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mentorId = params?.id;

  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMode, setSelectedMode] = useState("video");
  const [selectedDuration, setSelectedDuration] = useState("15");
  const [newReview, setNewReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // --- API Data Fetching ---
  useEffect(() => {
    if (!mentorId) {
      setIsLoading(false);
      setError("No mentor ID specified.");
      return;
    }

    const fetchMentorDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await getMentorById(mentorId);
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch mentor details');
        }

        const mentorData = result.data;

        // Process pricing structure from backend
        const pricingForType = (type) => {
          const pricing = mentorData.registrationRef?.pricing || [];
          const priceData = pricing.find(p => p.type === type);
          return priceData?.price || 30; // Default fallback in INR
        };

        const transformedMentor = {
          id: mentorData._id,
          name: mentorData.userRef.name,
          image: mentorData.userRef.avatar || "https://i.pravatar.cc/150?img=12",
          email: mentorData.userRef.email,
          title: mentorData.registrationRef?.qualification?.[0] || 'Professional Mentor',
          rating: mentorData.rating || 4.5,
          pricing: mentorData.registrationRef?.pricing || [
            { type: "chat", price: 10, duration: 1 },
            { type: "video", price: 30, duration: 1 }
          ],
          chatPricePerMinute: pricingForType("chat"),
          videoPricePerMinute: pricingForType("video"),
          voicePricePerMinute: pricingForType("voice"),
          minSessionDuration: mentorData.registrationRef?.minSessionDuration || 15,
          isActive: mentorData.registrationRef?.isActive || false,
          isAvailableNow: mentorData.registrationRef?.isAvailableNow || false,
          availabilitySchedule: mentorData.registrationRef?.availability || [],
          location: mentorData.location || "Location not specified",
          expertise: mentorData.registrationRef?.expertise || [],
          experience: mentorData.registrationRef?.experience || mentorData.experience || "Experience not specified",
          qualifications: mentorData.registrationRef?.qualification || [],
          about: mentorData.registrationRef?.description || "Experienced professional mentor dedicated to helping students succeed.",
          socials: mentorData.socials || {},
          stats: {
            sessionsCompleted: mentorData.sessionsCompleted || 0,
            totalMinutes: mentorData.totalMinutes || 0,
            rating: mentorData.rating || 4.5,
          },
        };

        setMentor(transformedMentor);
        
        if (mentorData.reviews && Array.isArray(mentorData.reviews)) {
          setReviews(mentorData.reviews);
        }

        if (mentorData.availableScheduleDates && Array.isArray(mentorData.availableScheduleDates)) {
          setAvailableDates(mentorData.availableScheduleDates);
        }
        if (mentorData.bookedScheduleDates && Array.isArray(mentorData.bookedScheduleDates)) {
          setBookedDates(mentorData.bookedScheduleDates);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorDetails();
  }, [mentorId]);

  const handleGoBack = () => {
    router.push('/mentors');
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading mentor details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Error State ---
  if (error || !mentor) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-2xl max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-red-400 text-xl font-bold mb-3">Unable to Load Mentor</h2>
            <p className="text-red-300 mb-4">{error || 'Mentor not found'}</p>
            <button
              onClick={handleGoBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              Go Back to Mentors
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Main Content (New Design + API Data) ---
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
            <SocialLinks socials={mentor.socials} />
          </div>

          <div className="lg:col-span-3 space-y-5 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold">{mentor.name}</h1>
            <p className="text-2xl sm:text-3xl text-blue-400">{mentor.title}</p>
            <p className="text-lg sm:text-xl text-gray-400">{mentor.location}</p>
            <p className="text-lg sm:text-xl text-blue-100">{mentor.experience}</p>

            {mentor.expertise.length > 0 && (
              <div className="bg-gray-800 p-5 mt-5 rounded-xl">
                <h3 className="text-blue-300 font-semibold mb-2 text-xl">Specializations</h3>
                <ul className="list-disc list-inside text-gray-200 space-y-2 text-lg sm:text-xl">
                  {mentor.expertise.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

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
                {reviews.length > 0 ? (
                  reviews.map((review, idx) => (
                    <div key={idx} className="bg-gray-800 p-5 rounded-xl">
                      <p className="text-gray-200 text-lg sm:text-xl">“{review}”</p>
                      <p className="text-sm sm:text-base text-gray-500 mt-2">– Anonymous</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-lg sm:text-xl">No reviews yet.</p>
                )}
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

        {/* --- This is the updated, API-driven modal call --- */}
        {showModal && (
          <ScheduleSessionModal
            onClose={() => setShowModal(false)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            mentorPricing={mentor.pricing} // Uses the full pricing object
            minSessionDuration={mentor.minSessionDuration}
            availableDates={availableDates}
            bookedDates={bookedDates}
            DAY_WISE_AVAILABILITY={mentor.availabilitySchedule}
          />
        )}
      </section>
      <Footer />
    </div>
  );
}