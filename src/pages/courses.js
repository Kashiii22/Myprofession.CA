"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/chatbotwidget"; // Assuming you want this too
import AOS from "aos";
import "aos/dist/aos.css";
import { FaStar, FaLevelUpAlt, FaClock, FaArrowRight } from "react-icons/fa";

// --- Dummy Data for Courses (with new image placeholders) ---
const coursesData = [
  {
    id: 1,
    title: "Mastering Direct Taxation: From Basics to Advanced",
    instructorName: "CA Rohan Mehta",
    instructorImage: "https://i.pravatar.cc/150?img=32",
    price: "4,999",
    level: "Advanced",
    duration: "25 Hours",
    rating: 4.9,
    reviews: 120,
    // ✅ CHANGED: Using placeholder.com for a working image
    thumbnail: "https://via.placeholder.com/400x225/1a1a1e/ffffff?text=Direct+Taxation", 
  },
  {
    id: 2,
    title: "The Complete Guide to GST Compliance",
    instructorName: "CA Karan Shah",
    instructorImage: "https://i.pravatar.cc/150?img=49",
    price: "2,499",
    level: "Intermediate",
    duration: "15 Hours",
    rating: 4.8,
    reviews: 95,
    // ✅ CHANGED: Using placeholder.com for a working image
    thumbnail: "https://via.placeholder.com/400x225/1a1a1e/ffffff?text=GST+Compliance",
  },
  {
    id: 3,
    title: "Audit & Assurance: A Practical Approach",
    instructorName: "CA Anjali Verma",
    instructorImage: "https://i.pravatar.cc/150?img=47",
    price: "3,999",
    level: "Intermediate",
    duration: "20 Hours",
    rating: 4.9,
    reviews: 110,
    // ✅ CHANGED: Using placeholder.com for a working image
    thumbnail: "https://via.placeholder.com/400x225/1a1a1e/ffffff?text=Audit+&+Assurance",
  },
  {
    id: 4,
    title: "Financial Modeling & Investment Analysis",
    instructorName: "CA Nidhi Sinha",
    instructorImage: "https://i.pravatar.cc/150?img=58",
    price: "5,999",
    level: "Advanced",
    duration: "30 Hours",
    rating: 5.0,
    reviews: 150,
    // ✅ CHANGED: Using placeholder.com for a working image
    thumbnail: "https://via.placeholder.com/400x225/1a1a1e/ffffff?text=Financial+Modeling",
  },
  {
    id: 5,
    title: "Beginner's Guide to Accounting Standards (AS/Ind AS)",
    instructorName: "CA Manish Kapoor",
    instructorImage: "https://i.pravatar.cc/150?img=60",
    price: "1,999",
    level: "Beginner",
    duration: "10 Hours",
    rating: 4.7,
    reviews: 78,
    // ✅ CHANGED: Using placeholder.com for a working image
    thumbnail: "https://via.placeholder.com/400x225/1a1a1e/ffffff?text=Accounting+Standards",
  },
  {
    id: 6,
    title: "Costing & CMA Techniques for Professionals",
    instructorName: "CA Sneha Goyal",
    instructorImage: "https://i.pravatar.cc/150?img=33",
    price: "3,499",
    level: "Intermediate",
    duration: "18 Hours",
    rating: 4.8,
    reviews: 88,
    // ✅ CHANGED: Using placeholder.com for a working image
    thumbnail: "https://via.placeholder.com/400x225/1a1a1e/ffffff?text=Costing+&+CMA",
  },
];
// --- End of Dummy Data ---

export default function CoursesPage() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e10] text-gray-200 font-sans relative overflow-x-hidden">
      <Header />

      {/* --- ❌ REMOVED: PAGE HERO SECTION --- */}
      
      {/* --- COURSE GRID --- */}
      {/* ✅ CHANGED: Added pt-32 (padding-top) to give space below the header */}
      <section className="py-20 pt-32 px-6 md:px-20"> 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {coursesData.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              delay={index * 100} // Staggered animation
            />
          ))}
        </div>
      </section>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}

// --- Course Card Component (Unchanged) ---
function CourseCard({ course, delay }) {
  const router = useRouter();

  const handleCardClick = () => {
    // Navigate to a dynamic course details page
    router.push(`/courses/${course.id}`);
  };

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={delay}
      onClick={handleCardClick}
      className="bg-[#1a1a1e] rounded-xl border border-gray-700 shadow-lg flex flex-col h-full overflow-hidden transition-all duration-300 group cursor-pointer hover:border-blue-500 hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      {/* --- Image --- */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          // Handle image errors gracefully
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/400x225?text=MyProfession.CA";
          }}
        />
      </div>

      {/* --- Content --- */}
      <div className="p-6 flex flex-col flex-grow">
        {/* --- Title --- */}
        <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>

        {/* --- Instructor --- */}
        <div className="flex items-center gap-3 mt-2 mb-4">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={course.instructorImage}
              alt={course.instructorName}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm text-gray-300 font-medium">
            {course.instructorName}
          </span>
        </div>

        {/* --- Meta Info (Level & Duration) --- */}
        <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-2">
            <FaLevelUpAlt className="text-blue-400" />
            {course.level}
          </span>
          <span className="flex items-center gap-2">
            <FaClock className="text-blue-400" />
            {course.duration}
          </span>
        </div>

        {/* --- Price & Rating (at the bottom) --- */}
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-700">
          <span className="text-2xl font-bold text-blue-400">
            ₹{course.price}
          </span>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="text-white font-bold">{course.rating}</span>
            <span className="text-gray-400 text-sm">({course.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
}