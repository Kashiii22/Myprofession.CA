"use client";

import { useEffect, useState, memo } from "react";
import { useParams, useRouter } from 'next/navigation';
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import {
  FaStar, FaStarHalfAlt, FaRegStar, FaArrowLeft,
  FaTwitter, FaLinkedin, FaGlobe,
  FaRegClock, FaCalendarAlt, FaChartLine,
  FaCheckCircle, FaAward, FaUsers, FaMoneyBillWave,
  FaLaptop, FaVideo, FaPhone, FaBrain,
  FaBookOpen, FaTrophy, FaHandshake, FaGraduationCap,
  FaUserGraduate, FaCheck, FaBriefcase, FaMapMarkerAlt,
  FaCertificate, FaUniversity
} from "react-icons/fa";

import Header from "@/components/Header";
import ScheduleSessionModal from "@/components/ScheduleSessionModal";
import Footer from "@/components/Footer";
import { getMentorById } from '@/lib/api/mentorApi';

const RenderStars = memo(({ rating }) => (
  <div className="flex gap-1 text-xl">
    {Array.from({ length: 5 }, (_, i) => {
      const value = i + 1;
      if (rating >= value) return <FaStar key={value} className="text-yellow-400" />;
      if (rating >= value - 0.5) return <FaStarHalfAlt key={value} className="text-yellow-400" />;
      return <FaRegStar key={value} className="text-yellow-400" />;
    })}
  </div>
));

const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-800 rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-all hover:scale-105">
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 ${color} rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform`}></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
          <Icon className={`text-2xl ${color}`} />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{value}</div>
          {subtext && <div className="text-xs text-gray-400">{subtext}</div>}
        </div>
      </div>
      <div className="text-gray-400 text-sm font-medium">{label}</div>
    </div>
  </div>
);

export default function MentorDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Handle case where params.id is not available yet
  if (!params?.id) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await getMentorById(params?.id);
        
        // CONSOLE LOGGING - Show raw backend data
        console.log('🔍 BACKEND MENTOR DATA STRUCTURE:');
        console.log('Full API Response:', result);
        console.log('Mentor Data:', result.data);
        console.log('User Reference:', result.data?.userRef);
        console.log('Registration Reference:', result.data?.registrationRef);
        console.log('Available Schedule Dates:', result.data?.availableScheduleDates);
        console.log('Booked Schedule Dates:', result.data?.bookedScheduleDates);
        console.log('Pricing Array:', result.data?.registrationRef?.pricing);
        console.log('Availability Array:', result.data?.registrationRef?.availability);
        console.log('Min Session Duration:', result.data?.registrationRef?.minSessionDuration);
        console.log('Is Active:', result.data?.registrationRef?.isActive);
        console.log('Is Available Now:', result.data?.registrationRef?.isAvailableNow);
        
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
          // Handle pricing per type from backend pricing array
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
          // Process day-wise availability
          availabilitySchedule: mentorData.registrationRef?.availability || [],
          location: mentorData.location || "",
          expertise: mentorData.registrationRef?.expertise || [],
          experience: mentorData.registrationRef?.experience || mentorData.experience || "",
          qualifications: mentorData.registrationRef?.qualification || [],
          about: mentorData.registrationRef?.description || "Experienced professional mentor dedicated to helping students succeed.",
          socials: mentorData.socials || {},
          registrationStatus: mentorData.registrationRef?.status || "",
          verificationStatus: mentorData.registrationRef?.verificationStatus || "",
          availableScheduleDates: mentorData.availableScheduleDates || [],
          bookedScheduleDates: mentorData.bookedScheduleDates || [],
          achievements: mentorData.registrationRef?.achievements || [],
          stats: {
            sessionsCompleted: mentorData.sessionsCompleted || 0,
            totalMinutes: mentorData.totalMinutes || 0,
            rating: mentorData.rating || 4.5,
          },
        };

        // CONSOLE LOGGING - Show transformed data
        console.log('\n✅ TRANSFORMED DATA:');
        console.log('Transformed Mentor:', transformedMentor);
        console.log('Chat Price Per Minute (INR):', transformedMentor.chatPricePerMinute);
        console.log('Video Price Per Minute (INR):', transformedMentor.videoPricePerMinute);
        console.log('Voice Price Per Minute (INR):', transformedMentor.voicePricePerMinute);
        console.log('Min Session Duration:', transformedMentor.minSessionDuration);
        console.log('Availability Schedule:', transformedMentor.availabilitySchedule);
        console.log('Is Active:', transformedMentor.isActive);
        console.log('Is Available Now:', transformedMentor.isAvailableNow);
        console.log('All Expertise Array:', transformedMentor.expertise);
        console.log('Available Dates for Modal:', transformedMentor.availableScheduleDates);
        console.log('Booked Dates for Modal:', transformedMentor.bookedScheduleDates);

        setMentor(transformedMentor);
        
        // CONSOLE LOGGING - Show reviews and availability setting
        console.log('\n📅 AVAILABILITY & REVIEWS:');
        
        // Use reviews from backend if available
        if (mentorData.reviews && Array.isArray(mentorData.reviews)) {
          console.log('Reviews Found:', mentorData.reviews.length);
          console.log('Reviews Data:', mentorData.reviews);
          setReviews(mentorData.reviews);
        } else {
          console.log('No Reviews Found in Backend');
        }

        // Set availability dates for the modal
        if (mentorData.availableScheduleDates && Array.isArray(mentorData.availableScheduleDates)) {
          console.log('Setting Available Dates:', mentorData.availableScheduleDates);
          setAvailableDates(mentorData.availableScheduleDates);
        }
        if (mentorData.bookedScheduleDates && Array.isArray(mentorData.bookedScheduleDates)) {
          console.log('Setting Booked Dates:', mentorData.bookedScheduleDates);
          setBookedDates(mentorData.bookedScheduleDates);
        }

        console.log('\n🎯 FINAL STATE:');
        console.log('Mentor Name:', transformedMentor.name);
        console.log('Is Mentor Set?', !!transformedMentor);
        console.log('Available Dates Count:', transformedMentor.availableScheduleDates?.length || 0);
        console.log('Booked Dates Count:', transformedMentor.bookedScheduleDates?.length || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorDetails();
  }, [params?.id]);

  const handleGoBack = () => {
    router.push('/mentors');
  };

  // Professional Stats Data
  const professionalStats = mentor ? [
    {
      label: "Total Sessions",
      value: mentor.stats.sessionsCompleted,
      subtext: "Completed",
      icon: FaCalendarAlt,
      color: "text-blue-400"
    },
    {
      label: "Experience",
      value: mentor.experience || "5+ Years",
      subtext: "Professional",
      icon: FaUserGraduate,
      color: "text-green-400"
    },
    {
      label: "Rating",
      value: `${mentor.stats.rating}/5`,
      subtext: `${mentor.stats.sessionsCompleted} reviews`,
      icon: FaStar,
      color: "text-yellow-400"
    },
    {
      label: "Success Rate",
      value: "98%",
      subtext: "Student satisfaction",
      icon: FaAward,
      color: "text-purple-400"
    }
  ] : [];

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

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[400px] bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        <div className="relative z-10 px-6 pt-8 max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Mentors</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Mentor Info */}
            <div className="lg:col-span-2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {mentor.name}
                </span>
              </h1>
              
              <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl text-blue-400 font-medium">{mentor.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RenderStars rating={mentor.rating} />
                  <span className="text-gray-400">({mentor.stats.rating}/5)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start text-sm">
                {mentor.isActive && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-700 rounded-full">
                    <FaCheckCircle className="text-green-400 text-xs" />
                    <span className="text-green-400">Active</span>
                  </span>
                )}
                {mentor.isAvailableNow && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/30 border border-blue-700 rounded-full">
                    <FaRegClock className="text-blue-400 text-xs" />
                    <span className="text-blue-400">Available Now</span>
                  </span>
                )}
                <span className="px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-gray-400">
                  Min: {mentor.minSessionDuration} min
                </span>
              </div>
            </div>

            {/* Mentor Image */}
            <div className="relative">
              <div className="relative group">
                <div className="w-40 h-40 sm:w-48 sm:h-48 relative">
                  <Image
                    src={mentor.image}
                    alt={mentor.name}
                    fill
                    className="object-cover rounded-full border-4 border-blue-500 shadow-2xl"
                    sizes="192px"
                  />
                  {mentor.verificationStatus === 'verified' && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 border-4 border-black">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                  )}
                </div>
                
                {/* Floating Action Button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                >
                  <FaCalendarAlt className="text-sm" />
                  Book Session
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-aos="fade-up">
          {professionalStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-800/50 rounded-2xl p-8 shadow-2xl" data-aos="fade-right">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-900/30 rounded-xl border border-blue-700">
                  <FaBrain className="text-blue-400 text-xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">About</h2>
                  <p className="text-sm text-blue-400">Professional Profile</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Experience Highlight */}
                {mentor.experience && (
                  <div className="p-6 bg-blue-900/20 rounded-xl border border-blue-800">
                    <div className="flex items-center gap-3 mb-3">
                      <FaUserGraduate className="text-blue-400 text-xl" />
                      <h3 className="text-xl font-semibold text-blue-400">Experience</h3>
                    </div>
                    <p className="text-gray-200 text-lg leading-relaxed">{mentor.experience}</p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <p className="text-gray-300 leading-relaxed text-lg">{mentor.about}</p>
                </div>
              </div>
            </div>

            {/* Expertise Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-800/50 rounded-2xl p-8 shadow-2xl" data-aos="fade-right">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-900/30 rounded-xl border border-purple-700">
                  <FaBriefcase className="text-purple-400 text-xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Expertise</h2>
                  <p className="text-sm text-purple-400">Areas of Specialization</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {mentor.expertise.length > 0 ? 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mentor.expertise.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-purple-900/20 rounded-xl border border-purple-800">
                        <FaCheck className="text-purple-400 text-sm" />
                        <span className="text-purple-300 font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                  : (
                  <p className="text-gray-400 text-center py-8">No expertise areas specified</p>
                )}
              </div>
            </div>

            {/* Schedule Availability */}
            {mentor.availabilitySchedule && mentor.availabilitySchedule.length > 0 && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-green-800/50 rounded-2xl p-8 shadow-2xl" data-aos="fade-right">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-900/30 rounded-xl border border-green-700">
                    <FaCalendarAlt className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Schedule</h2>
                    <p className="text-sm text-green-400">Available Time Slots</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mentor.availabilitySchedule.map((dayAvailability, index) => (
                    <div key={index} className="p-4 bg-green-900/20 rounded-xl border border-green-800">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-green-400 font-semibold text-lg">{dayAvailability.day}</span>
                        <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded-full text-sm">
                          {dayAvailability.slots?.length || 0} slots
                        </span>
                      </div>
                      <div className="space-y-2">
                        {dayAvailability.slots && dayAvailability.slots.length > 0 ? 
                          dayAvailability.slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex justify-between text-sm">
                              <span className="text-gray-400">{slot.startTime}</span>
                              <span className="text-gray-500">►</span>
                              <span className="text-gray-400">{slot.endTime}</span>
                            </div>
                          )) : (
                          <p className="text-gray-500 text-sm italic">No time slots</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-yellow-800/50 rounded-2xl p-8 shadow-2xl" data-aos="fade-right">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-900/30 rounded-xl border border-yellow-700">
                  <FaStar className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Reviews</h2>
                  <p className="text-sm text-yellow-400">Student Feedback</p>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.length > 0 ? 
                  reviews.map((review, idx) => (
                    <div key={idx} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} className="text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-200 text-lg">"{review}"</p>
                      <p className="text-gray-500 mt-3">– Student Review</p>
                    </div>
                  )) : (
                  <div className="text-center py-12">
                    <div className="text-4xl text-gray-600 mb-4">⭐</div>
                    <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>

              {/* Add Review */}
              <div className="pt-6 border-t border-gray-700">
                <h3 className="text-xl font-medium text-white mb-4">Share Your Experience</h3>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="How was your session with this mentor? Share your thoughts..."
                  className="w-full p-4 text-lg bg-gray-800 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <button
                  onClick={() => {
                    if (newReview.trim()) {
                      setReviews((prev) => [...prev, newReview]);
                      setNewReview("");
                    }
                  }}
                  className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold transition-all transform hover:scale-105"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 sticky top-8">
            {/* pricing */}
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-600 p-6 rounded-2xl shadow-2xl" data-aos="fade-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-700/30 rounded-xl border border-blue-500">
                  <FaMoneyBillWave className="text-blue-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Pricing</h3>
                  <p className="text-sm text-blue-400">Per Minute Rates</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-900/50 p-4 rounded-xl border border-blue-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <FaPhone className="text-blue-300" />
                      <span className="text-white font-medium">Chat</span>
                    </span>
                    <span className="text-2xl font-bold text-blue-400">₹{mentor.chatPricePerMinute}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-900/50 p-4 rounded-xl border border-green-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <FaVideo className="text-green-300" />
                      <span className="text-white font-medium">Video</span>
                    </span>
                    <span className="text-2xl font-bold text-green-400">₹{mentor.videoPricePerMinute}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-900/50 p-4 rounded-xl border border-purple-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <FaLaptop className="text-purple-300 text-sm" />
                      <span className="text-white font-medium">Voice</span>
                    </span>
                    <span className="text-2xl font-bold text-purple-400">₹{mentor.voicePricePerMinute}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <p className="text-center text-gray-400 text-sm">
                  Minimum session: <span className="text-blue-400 font-semibold">{mentor.minSessionDuration} minutes</span>
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-700 rounded-2xl p-6 shadow-2xl" data-aos="fade-left">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <FaChartLine className="text-blue-400" />
                Performance Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400 text-sm">Sessions</span>
                  <span className="text-xl font-bold text-blue-400">{mentor.stats.sessionsCompleted}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400 text-sm">Total Minutes</span>
                  <span className="text-xl font-bold text-green-400">{mentor.stats.totalMinutes}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400 text-sm">Rating</span>
                  <span className="text-xl font-bold text-yellow-400">{mentor.stats.rating}/5.0</span>
                </div>
              </div>
            </div>

            {/* Qualifications */}
            {mentor.qualifications && mentor.qualifications.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-700 rounded-2xl p-6 shadow-2xl" data-aos="fade-left">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FaUniversity className="text-blue-400" />
                  Qualifications
                </h3>
                
                <div className="space-y-2">
                  {mentor.qualifications.map((qual, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <FaCertificate className="text-blue-400" />
                      <span className="text-gray-200">{qual}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {mentor.socials && (
              <div className="text-center" data-aos="fade-left">
                <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
                <div className="flex justify-center gap-4 text-2xl text-blue-400">
                  {mentor.socials.twitter && (
                    <a href={mentor.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <FaTwitter />
                    </a>
                  )}
                  {mentor.socials.linkedin && (
                    <a href={mentor.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <FaLinkedin />
                    </a>
                  )}
                  {mentor.socials.website && (
                    <a href={mentor.socials.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <FaGlobe />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Schedule Modal */}
      {showModal && (
        (() => {
          console.log('\n📅 OPENING SCHEDULE MODAL:');
          console.log('Available Dates Passed to Modal:', availableDates);
          console.log('Booked Dates Passed to Modal:', bookedDates);
          console.log('Day Wise Availability Passed to Modal:', mentor.availabilitySchedule);
          console.log('Mentor Chat Price (INR):', mentor.chatPricePerMinute);
          console.log('Mentor Video Price (INR):', mentor.videoPricePerMinute);
          console.log('Mentor Voice Price (INR):', mentor.voicePricePerMinute);
          console.log('Min Session Duration:', mentor.minSessionDuration);
          
          return (
            <ScheduleSessionModal
              onClose={() => setShowModal(false)}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
              mentorPricing={mentor.pricing}
              minSessionDuration={mentor.minSessionDuration}
              availableDates={availableDates}
              bookedDates={bookedDates}
              DAY_WISE_AVAILABILITY={mentor.availabilitySchedule}
            />
          );
        })()
      )}
    </div>
  );
}
