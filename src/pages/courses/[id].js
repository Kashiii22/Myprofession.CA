"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/chatbotwidget";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaStar,
  FaLevelUpAlt,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaVideo,
  FaFileAlt,
  FaAward,
} from "react-icons/fa"; // Removed FaShieldAlt

// --- Dummy Data (Expanded for all 6 courses) ---
// In a real app, you'd fetch this data based on the ID.
const coursesData = [
  // --- Course 1 (Full Details) ---
  {
    id: 1,
    title: "Mastering Direct Taxation: From Basics to Advanced",
    tagline:
      "A comprehensive guide to understanding and applying direct tax laws in India.",
    instructorName: "CA Rohan Mehta",
    instructorImage: "https://i.pravatar.cc/150?img=32",
    instructorBio:
      "CA Rohan Mehta is a practicing Chartered Accountant with over 12 years of experience in direct taxation. He has advised Fortune 500 companies and startups on complex tax matters.",
    price: "4,999",
    level: "Advanced",
    duration: "25 Hours",
    rating: 4.9,
    reviews: 120,
    thumbnail:
      "https://via.placeholder.com/600x340/1a1a1e/ffffff?text=Direct+Taxation+Course",
    whatYoullLearn: [
      "Understand the fundamentals of the Income Tax Act.",
      "Confidently file ITR-3, ITR-5, and ITR-6.",
      "Master complex topics like TDS, TCS, and Advance Tax.",
      "Learn about tax planning and saving strategies.",
      "Handle tax assessments and appeals.",
    ],
    curriculum: [
      {
        title: "Module 1: Introduction to Direct Tax",
        lectures: [
          { title: "Overview of Income Tax Act", duration: "15:00" },
          { title: "Key Definitions and Concepts", duration: "25:00" },
          { title: "Residential Status", duration: "30:00" },
        ],
      },
      {
        title: "Module 2: Heads of Income",
        lectures: [
          { title: "Income from Salary", duration: "45:00" },
          { title: "Income from House Property", duration: "35:00" },
          { title: "PGBP", duration: "01:15:00" },
          { title: "Income from Capital Gains", duration: "55:00" },
        ],
      },
      {
        title: "Module 3: Tax Filing and Compliance",
        lectures: [
          { title: "Understanding TDS and TCS", duration: "40:00" },
          { title: "Filing ITR-3 and ITR-5", duration: "01:00:00" },
        ],
      },
    ],
    requirements: [
      "Basic understanding of accounting principles.",
      "No prior tax knowledge is required, but it is helpful.",
      "A computer with internet access.",
    ],
    whoThisIsFor: [
      "CA Students (Inter and Final)",
      "Newly Qualified Chartered Accountants",
      "Accountants and Tax Professionals",
      "Business owners looking to manage their taxes.",
    ],
  },
  // --- Course 2 (Skeleton Data) ---
  {
    id: 2,
    title: "The Complete Guide to GST Compliance",
    tagline: "Navigate the complexities of GST with confidence.",
    instructorName: "CA Karan Shah",
    instructorImage: "https://i.pravatar.cc/150?img=49",
    instructorBio: "CA Karan Shah is a leading GST consultant and trainer.",
    price: "2,499",
    level: "Intermediate",
    duration: "15 Hours",
    rating: 4.8,
    reviews: 95,
    thumbnail:
      "https://via.placeholder.com/600x340/1a1a1e/ffffff?text=GST+Compliance+Course",
    whatYoullLearn: [
      "Understand GST framework and compliance.",
      "File GSTR-1, GSTR-3B, and GSTR-9.",
      "Handle E-way bills and input tax credit (ITC).",
    ],
    curriculum: [
      {
        title: "Module 1: GST Basics",
        lectures: [{ title: "Introduction to GST", duration: "20:00" }],
      },
      {
        title: "Module 2: GST Filing",
        lectures: [{ title: "Live Filing Demo", duration: "45:00" }],
      },
    ],
    requirements: ["Basic computer knowledge."],
    whoThisIsFor: ["Accountants", "Small business owners", "CA Students"],
  },
  // --- Add skeleton data for courses 3, 4, 5, 6 ---
  {
    id: 3,
    title: "Audit & Assurance: A Practical Approach",
    /* ... (add skeleton data like course 2) ... */
    tagline: "Learn practical audit techniques from an expert.",
    instructorName: "CA Anjali Verma",
    instructorImage: "https://i.pravatar.cc/150?img=47",
    instructorBio: "CA Anjali Verma has 10+ years in statutory audit.",
    price: "3,999",
    level: "Intermediate",
    duration: "20 Hours",
    rating: 4.9,
    reviews: 110,
    thumbnail:
      "https://via.placeholder.com/600x340/1a1a1e/ffffff?text=Audit+Course",
    whatYoullLearn: ["Audit planning", "Risk assessment", "Reporting"],
    curriculum: [
      {
        title: "Module 1: Audit Planning",
        lectures: [{ title: "Client Acceptance", duration: "30:00" }],
      },
    ],
    requirements: ["Basic accounting knowledge."],
    whoThisIsFor: ["CA Students", "Audit Assistants"],
  },
  {
    id: 4,
    title: "Financial Modeling & Investment Analysis",
    /* ... (add skeleton data like course 2) ... */
    tagline: "Build financial models from scratch.",
    instructorName: "CA Nidhi Sinha",
    instructorImage: "https://i.pravatar.cc/150?img=58",
    instructorBio: "CA Nidhi Sinha is an investment banking professional.",
    price: "5,999",
    level: "Advanced",
    duration: "30 Hours",
    rating: 5.0,
    reviews: 150,
    thumbnail:
      "https://via.placeholder.com/600x340/1a1a1e/ffffff?text=Financial+Modeling",
    whatYoullLearn: ["Excel modeling", "Valuation techniques (DCF,)"
    ],
    curriculum: [
      {
        title: "Module 1: Excel Basics",
        lectures: [{ title: "Key Functions", duration: "45:00" }],
      },
    ],
    requirements: ["MS Excel installed."],
    whoThisIsFor: ["Finance Professionals", "MBA Students"],
  },
  {
    id: 5,
    title: "Beginner's Guide to Accounting Standards (AS/Ind AS)",
    /* ... (add skeleton data like course 2) ... */
    tagline: "Understand the core principles of AS & Ind AS.",
    instructorName: "CA Manish Kapoor",
    instructorImage: "https://i.pravatar.cc/150?img=60",
    instructorBio: "CA Manish Kapoor is a professor of accounting.",
    price: "1,999",
    level: "Beginner",
    duration: "10 Hours",
    rating: 4.7,
    reviews: 78,
    thumbnail:
      "https://via.placeholder.com/600x340/1a1a1e/ffffff?text=Accounting+Standards",
    whatYoullLearn: ["AS vs Ind AS", "Key standards explained"],
    curriculum: [
      {
        title: "Module 1: Introduction",
        lectures: [{ title: "Framework", duration: "30:00" }],
      },
    ],
    requirements: ["None"],
    whoThisIsFor: ["B.Com Students", "CA Foundation Students"],
  },
  {
    id: 6,
    title: "Costing & CMA Techniques for Professionals",
    /* ... (add skeleton data like course 2) ... */
    tagline: "Master costing techniques for business decisions.",
    instructorName: "CA Sneha Goyal",
    instructorImage: "https://i.pravatar.cc/150?img=33",
    instructorBio: "CA Sneha Goyal is a management accountant.",
    price: "3,499",
    level: "Intermediate",
    duration: "18 Hours",
    rating: 4.8,
    reviews: 88,
    thumbnail:
      "https://via.placeholder.com/600x340/1a1a1e/ffffff?text=Costing+CMA",
    whatYoullLearn: ["Marginal Costing", "Standard Costing", "Budgeting"],
    curriculum: [
      {
        title: "Module 1: Costing Basics",
        lectures: [{ title: "Cost Sheet", duration: "40:00" }],
      },
    ],
    requirements: ["Basic understanding of costs."],
    whoThisIsFor: ["CMA Students", "Factory Accountants"],
  },
];

// --- A. Course Content Accordion Component (Unchanged) ---
function CourseAccordion({ section }) {
  const [isOpen, setIsOpen] = useState(false);

  // Default to first section open
  useEffect(() => {
    if (section.title.includes("Module 1")) {
      setIsOpen(true);
    }
  }, [section.title]);

  return (
    <div className="border border-gray-700 bg-[#1f1f23]/70 rounded-lg mb-3">
      {/* --- Accordion Header --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left"
      >
        <span className="text-lg font-semibold text-white">{section.title}</span>
        {isOpen ? (
          <FaChevronUp className="text-blue-400" />
        ) : (
          <FaChevronDown className="text-gray-400" />
        )}
      </button>

      {/* --- Accordion Content --- */}
      {isOpen && (
        <div className="p-5 pt-0">
          <ul className="space-y-3">
            {section.lectures.map((lecture, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-gray-300"
              >
                <span className="flex items-center gap-3">
                  <FaVideo className="text-gray-500" />
                  {lecture.title}
                </span>
                <span className="text-sm text-gray-500">
                  {lecture.duration}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- B. The Main Page Component ---
export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // --- Data Fetching ---
  const course = coursesData.find((c) => c.id.toString() === id);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 50 });
  }, []);

  // --- Handle Course Not Found ---
  if (!course) {
    return (
      <div className="min-h-screen bg-[#0e0e10] text-gray-200">
        <Header />
        <div className="py-40 text-center">
          <h1 className="text-3xl font-bold text-white">Course Not Found</h1>
          <p className="text-gray-400 mt-4">
            Sorry, we couldn't find the course you're looking for.
          </p>
          <button
            onClick={() => router.push("/courses")}
            className="mt-8 bg-blue-600 text-white font-semibold py-3 px-6 rounded-full"
          >
            Back to All Courses
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Main Page Render ---
  return (
    <div className="min-h-screen bg-[#0e0e10] text-gray-200 font-sans relative">
      <Header />

      {/* --- 1. Top Hero Section (Course Intro) --- */}
      <section className="bg-gradient-to-br from-[#111216] to-[#1b1f25] pt-32 pb-16 px-6 md:px-20 border-b border-[#2c2c32]">
        <div className="max-w-7xl mx-auto" data-aos="fade-up">
          {/* Breadcrumbs */}
          <div className="text-sm text-blue-400 mb-3">
            <span
              onClick={() => router.push("/courses")}
              className="cursor-pointer hover:underline"
            >
              Courses
            </span>
            <span className="text-gray-500 mx-2">&gt;</span>
            <span className="text-gray-300">{course.title}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {course.title}
          </h1>
          <p className="text-xl text-gray-400 max-w-4xl mb-6">
            {course.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="text-white font-bold">{course.rating}</span>
              <span className="text-gray-400">({course.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLevelUpAlt className="text-blue-400" />
              <span className="text-gray-300">{course.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-blue-400" />
              <span className="text-gray-300">{course.duration}</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. Main Content (NEW 2-Column Layout) --- */}
      <section className="py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* --- LEFT COLUMN (Details) --- */}
          {/* ✅ CHANGED: Now contains the main course details */}
          <div className="lg:col-span-2 space-y-12 lg:order-1">
            {/* What You'll Learn (Moved to top) */}
            <div
              className="bg-[#1a1a1e] p-8 rounded-xl border border-gray-700"
              data-aos="fade-up"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                What you'll learn
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {course.whatYoullLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-blue-400 text-xl mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Content (Accordion) */}
            <div data-aos="fade-up">
              <h2 className="text-3xl font-bold text-white mb-6">
                Course Content
              </h2>
              {course.curriculum.map((section, index) => (
                <CourseAccordion key={index} section={section} />
              ))}
            </div>

            {/* Requirements */}
            <div data-aos="fade-up">
              <h2 className="text-3xl font-bold text-white mb-6">
                Requirements
              </h2>
              <ul className="space-y-3">
                {course.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaArrowRight className="text-blue-400 text-lg mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Who this course is for */}
             <div data-aos="fade-up">
              <h2 className="text-3xl font-bold text-white mb-6">
                Who this course is for
              </h2>
              <ul className="space-y-3">
                {course.whoThisIsFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaArrowRight className="text-blue-400 text-lg mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructor Profile */}
            <div
              className="bg-[#1a1a1e] p-8 rounded-xl border border-gray-700"
              data-aos="fade-up"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                About the Instructor
              </h2>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Image
                  src={course.instructorImage}
                  alt={course.instructorName}
                  width={100}
                  height={100}
                  className="rounded-full border-2 border-blue-500"
                />
                <div>
                  <h3 className="text-2xl font-bold text-blue-400">
                    {course.instructorName}
                  </h3>
                  <p className="text-gray-400 mt-4">{course.instructorBio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (Buy Box) --- */}
          {/* ✅ CHANGED: No longer sticky. Placed on right with lg:order-2 */}
          <div
            className="lg:col-span-1 lg:order-2 h-fit lg:sticky top-28"
            data-aos="fade-left"
          >
            <div className="bg-[#1a1a1e] rounded-xl border border-gray-700 shadow-xl overflow-hidden">
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={600}
                height={340}
                className="w-full object-cover"
              />
              <div className="p-6 space-y-5">
                <span className="text-4xl font-extrabold text-blue-400">
                  ₹{course.price}
                </span>

                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-6 rounded-lg text-lg hover:scale-105 transition-transform duration-300">
                  Buy Now
                </button>
                
                {/* --- ❌ REMOVED "Add to Cart" button --- */}
                {/* --- ❌ REMOVED "Money-Back Guarantee" --- */}

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="font-semibold text-white mb-3">
                    This course includes:
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-3">
                      <FaVideo className="text-blue-400" />
                      <span className="text-gray-300">
                        {course.duration} on-demand video
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaFileAlt className="text-blue-400" />
                      <span className="text-gray-300">12 Downloadable resources</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaAward className="text-blue-400" />
                      <span className="text-gray-300">
                        Certificate of completion
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}