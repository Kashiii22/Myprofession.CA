"use client";
import { useState, useEffect } from "react"; 
import {
  FaSearch,
  FaFileInvoiceDollar,
  FaClipboardCheck,
  FaScroll,
  FaBuilding,
  FaChartLine,
  FaBookOpen,
  FaArrowRight, // This is now used by CategoryCard
  FaCalculator,
  FaBriefcase,
  FaBalanceScale
} from "react-icons/fa";
import Image from "next/image";
import Header from "@/components/Header";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/navigation";
import { ShinyButton } from "@/components/magicui/shiny-button";
import ChatbotWidget from "@/components/chatbotwidget";
import Footer from "@/components/Footer";

// Mentor Data
const mentorsLeft = [
  { name: "CA Rohan Mehta", title: "Direct Tax Expert", image: "https://i.pravatar.cc/150?img=32", color: "bg-gradient-to-r from-indigo-700 to-indigo-900" },
  { name: "CA Anjali Verma", title: "Audit Mentor", image: "https://i.pravatar.cc/150?img=47", color: "bg-gradient-to-r from-pink-600 to-pink-800" },
  { name: "CA Karan Shah", title: "GST Specialist", image: "https://i.pravatar.cc/150?img=49", color: "bg-gradient-to-r from-blue-600 to-blue-800" },
];
const mentorsRight = [
  { name: "CA Nidhi Sinha", title: "Finance & Investment", image: "https://i.pravatar.cc/150?img=58", color: "bg-gradient-to-r from-teal-600 to-teal-800" },
  { name: "CA Manish Kapoor", title: "Accounts Guru", image: "https://i.pravatar.cc/150?img=60", color: "bg-gradient-to-r from-yellow-600 to-yellow-800" },
  { name: "CA Sneha Goyal", title: "CMA & Costing Mentor", image: "https://i.pravatar.cc/150?img=33", color: "bg-gradient-to-r from-rose-600 to-rose-800" },
];

// --- Content Categories (Descriptions Removed) ---
const contentCategories = [
  { name: "Income Tax", path: "/category/income-tax", icon: <FaFileInvoiceDollar /> },
  { name: "GST", path: "/category/gst", icon: <FaScroll /> },
  { name: "Accounting", path: "/category/accounting", icon: <FaCalculator /> },
  { name: "Audit", path: "/category/audit", icon: <FaClipboardCheck /> },
  { name: "Investment", path: "/category/investment", icon: <FaChartLine /> },
  { name: "ICAI & Articleship", path: "/category/icai-and-articleship", icon: <FaBriefcase /> },
  { name: "Law & MCA", path: "/category/law-and-mca", icon: <FaBalanceScale /> },
];

// --- Placeholder Course Data ---
const coursesData = [
  {
    id: 1,
    title: "Advanced GST Practice & Compliance",
    category: "GST",
    description: "A deep dive into GST returns, audits, and litigation with real-world case studies.",
    image: "https://images.unsplash.com/photo-1554224155-169543018d40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTU5MTR8MHwxfHNlYXJjaHwxfHxhY2NvdW50aW5nJTIwZmluYW5jZXxlbnwwfHx8fDE3MzExNzk4NTN8MA&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: 2,
    title: "Practical Income Tax Filing (ITR 1-7)",
    category: "Income Tax",
    description: "Learn to file all major ITR forms for individuals and businesses.",
    image: "https://images.unsplash.com/photo-1579621970795-87f51f47f2f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTU5MTR8MHwxfHNlYXJjaHwxfHx0YXglMjBpbmRpYXxlbnwwfHx8fDE3MzExNzk4ODN8MA&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: 3,
    title: "Statutory Audit Masterclass",
    category: "Audit",
    description: "From planning to execution and reporting, master the audit process.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTU5MTR8MHwxfHNlYXJjaHwxfHxjaGVja2xpc3QlMjBhdWRpdHxlbnwwfHx8fDE3MzExNzk5MDd8MA&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: 4,
    title: "Mastering Ind AS (Accounting)",
    category: "Accounting",
    description: "A practical guide to implementing Indian Accounting Standards.",
    image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTU5MTR8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBib2FyZHJvb218ZW58MHx8fHwxNzMxMTc5OTMxfDA&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: 5,
    title: "Stock Market & Investment Analysis",
    category: "Investment",
    description: "Learn fundamental and technical analysis for smart investing.",
    image: "https://images.unsplash.com/photo-1611974780784-907f763c3283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTU5MTR8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMGNoYXJ0fGVufDB8fHx8MTczMTE3OTk1M3ww&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: 6,
    title: "Articleship Success Guide",
    category: "ICAI & Articleship",
    description: "Navigate your articleship, manage time, and maximize learning.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTU5MTR8MHwxfHNlYXJjaHwxfHxtZWV0aW5nJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3MzExNzk5NzR8MA&ixlib=rb-4.0.3&q=80&w=1080"
  },
];


export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }, []);

  const filterCategories = ["All", ...contentCategories.map(c => c.name)];
  const filteredCourses = coursesData.filter(course => 
    selectedCategory === "All" || course.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#0e0e10] text-gray-200 font-sans relative overflow-x-hidden">
      <Header />

      {/* HERO SECTION */}
      <section className="relative z-10 px-4 md:px-10 py-20 overflow-hidden">
        {/* Section number in top-left corner */}
        <div className="absolute top-4 left-4 px-2 py-1 bg-gray-800/50 text-gray-600 text-xs font-medium rounded-lg z-10 pointer-events-none border border-gray-700/30">
          section-1
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Left Marquee */}
          <div className="hidden md:block h-[400px] overflow-hidden relative group">
            <div className="marquee-container animate-scroll-up group-hover:[animation-play-state:paused]">
              {[...Array(6)].map((_, loopIndex) =>
                mentorsLeft.map((mentor, idx) => (
                  <MentorCard key={`left-${loopIndex}-${idx}`} mentor={mentor} />
                ))
              )}
            </div>
            <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-[#0e0e10] via-[#0e0e10]/60 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/60 to-transparent z-20 pointer-events-none" />
          </div>

          {/* Center Content */}
          <div className="text-center" data-aos="fade-up">
            <h3 className="text-2xl md:text-3xl font-extrabold leading-snug">
              Connect with experienced <span className="text-blue-500"><br />CA Experts</span>
            </h3>
            <div className="mt-6 bg-[#1a1a1e]/90 p-8 rounded-xl border border-blue-700 shadow-md-blue w-full text-center">
              <div className="text-white text-base md:text-lg leading-relaxed break-words">
                If you are facing any issue in your CA journey whether related to <br />
                <span className="text-cyan-400 font-medium">Study/ Articleship/ Guidance/ Job</span> <br />
                You can connect with our CA Experts for
                <span className="block mt-3 text-blue-400 font-semibold text-3xl">
                  1:1 Discussion
                </span>
              </div>
            </div>
            <div className="mt-10 relative max-w-lg mx-auto">
              <div className="mt-6 flex justify-center">
                <ShinyButton
                  onClick={() => router.push("/mentors")}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-xl hover:scale-1all duration-300"
                >
                  Explore Our Consultants
                </ShinyButton>
              </div>
            </div>
          </div>

          {/* Right Marquee */}
          <div className="hidden md:block h-[400px] overflow-hidden relative group">
            <div className="marquee-container animate-scroll-down group-hover:[animation-play-state:paused]">
              {[...Array(6)].map((_, loopIndex) =>
                mentorsRight.map((mentor, idx) => (
                  <MentorCard key={`right-${loopIndex}-${idx}`} mentor={mentor} />
                ))
              )}
            </div>
            <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-[#0e0e10] via-[#0e0e10]/60 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/60 to-transparent z-20 pointer-events-none" />
          </div>
        </div>
        <style jsx>{`
          .marquee-container { display: flex; flex-direction: column; gap: 1.5rem; }
          .animate-scroll-up { animation: scrollUp 30s linear infinite; }
          .animate-scroll-down { animation: scrollDown 30s linear infinite; }
          @keyframes scrollUp { 0% { transform: translateY(0%); } 100% { transform: translateY(-50%); } }
          @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0%); } }
        `}</style>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="bg-gradient-to-br from-[#111216] to-[#1b1f25] backdrop-blur-md py-20 px-6 md:px-20 text-white border-t border-[#2c2c32] relative">
        {/* Section number in top-left corner */}
        <div className="absolute top-4 left-4 px-2 py-1 bg-gray-800/50 text-gray-600 text-xs font-medium rounded-lg z-10 pointer-events-none border border-gray-700/30">
          section-2
        </div>
        <div className="container mx-auto max-w-7xl text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 inline-block">
              <span className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg">
                Content and files
              </span>
            </h2>
            <p className="text-base md:text-lg font-semibold text-blue-400 tracking-wider mb-4">
              Read – Watch – Download – Follow
            </p>
            <div className="text-left max-w-full" data-aos="fade-up" data-aos-delay="100">
              <div className="pl-5 pr-5 pb-8">
                <p className="text-base text-gray-300 leading-relaxed mb-4">
                  Empower your professional journey with ready-to-use content, templates. Everything a CA needs — from Income Tax to Audit — to work smarter every day
                </p>
                <p className="text-sm text-gray-400">
                  Here you can access practical files, step-by-step guides, and real-life case studies created by experienced professionals related to following categories:
                </p>
              </div>
            </div>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {contentCategories.map((category) => (
                <CategoryCard
                  key={category.name}
                  icon={category.icon}
                  title={category.name}
                  onClick={() => router.push(category.path)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- COURSES SECTION --- */}
      <section className="py-20 px-6 md:px-20 text-white border-t border-[#2c2c32] relative">
        {/* Section number in top-left corner */}
        <div className="absolute top-4 left-4 px-2 py-1 bg-gray-800/50 text-gray-600 text-xs font-medium rounded-lg z-10 pointer-events-none border border-gray-700/30">
          section-3
        </div>
        <div className="container mx-auto max-w-7xl text-center">
          
          {/* 1. Main Title */}
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4 text-white" 
            data-aos="fade-up"
          >
            Our Courses
          </h2>
          
          {/* 2. Blinking Sub-Title (with new glow animation) */}
          <h3 
            className="text-2xl md:text-3xl font-semibold mb-6 text-green-400 animate-glow-green" 
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            CA Practical Courses Now Available!
          </h3>

          {/* 3. Subtitle (Description) */}
          <p 
            className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto" 
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            Take your professional skills to the next level with our industry-focused online courses designed especially for CA students and professionals.
          </p>

          {/* 4. Category Filters */}
          <div 
            className="flex flex-wrap justify-center gap-3 mb-12" 
            data-aos="fade-up" 
            data-aos-delay="300"
          >
            {filterCategories.map(category => (
              <FilterPill
                key={category}
                text={category}
                isActive={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>

          {/* 5. Course Cards Grid */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
            {/* Handle empty state */}
            {filteredCourses.length === 0 && (
              <p className="text-gray-400 text-lg sm:col-span-2 lg:col-span-3">
                No courses found for this category. Stay tuned!
              </p>
            )}
          </div>
          
        </div>
        
        {/* 6. "Glow" Animation CSS */}
        <style jsx>{`
          @keyframes glow-green {
            0%, 100% {
              /* Using green-400 */
              text-shadow: 0 0 8px rgba(52, 211, 153, 0.7);
            }
            50% {
              text-shadow: 0 0 20px rgba(52, 211, 153, 1), 0 0 30px rgba(52, 211, 153, 0.6);
            }
          }
          .animate-glow-green {
            animation: glow-green 1.8s ease-in-out infinite;
          }
        `}</style>
      </section>
      {/* --- END OF NEW SECTION --- */}


      {/* FOOTER */}
      <Footer />
      <ChatbotWidget />
    </div>
  );
}

// Mentor Card
function MentorCard({ mentor }) {
  return (
    <div className={`flex items-center gap-4 p-4 mx-auto max-w-xs rounded-xl shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl ${mentor.color}`}>
      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white">
        <Image src={mentor.image} alt={mentor.name} fill className="object-cover" />
      </div>
      <div className="text-left">
        <div className="text-md font-semibold text-white">{mentor.name}</div>
        <div className="text-sm text-gray-200">{mentor.title}</div>
      </div>
    </div>
  );
}


// --- ✅ MODIFIED: "CategoryCard" Component (with exciting arrow) ---
function CategoryCard({ icon, title, onClick }) {
  return (
    <div 
      onClick={onClick} 
      className="group cursor-pointer rounded-xl bg-[#1a1a1e] p-5 text-left
                 border border-gray-700/80
                 transition-all duration-300
                 hover:border-blue-500/80 hover:bg-[#202024] 
                 hover:shadow-xl hover:-translate-y-1" // Subtle lift effect
    >
      {/* This flex container pushes the arrow to the right */}
      <div className="flex items-center justify-between gap-4">
        
        {/* Left side (Icon + Title) */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center 
                          rounded-lg bg-gray-800/50 
                          text-blue-400 text-2xl 
                          transition-all duration-300 group-hover:bg-blue-700/20 group-hover:text-blue-300">
            {icon}
          </div>
          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 transition-colors duration-300 group-hover:text-white">
              {title}
            </h3>
          </div>
        </div>

        {/* Right side (Arrow) - Hides and shows on hover */}
        <div className="text-blue-400 text-xl
                        opacity-0 transition-all duration-300 
                        group-hover:opacity-100 group-hover:translate-x-1"> {/* Animates on hover */}
          <FaArrowRight />
        </div>

      </div>
    </div>
  );
}

// FilterPill Component
function FilterPill({ text, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-5 rounded-full font-semibold text-sm transition-all duration-300
        ${isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-[#1a1a1e] text-gray-400 border border-gray-700 hover:bg-[#2a2a2e] hover:text-white'
        }
      `}
    >
      {text}
    </button>
  );
}

// CourseCard Component
function CourseCard({ course }) {
  const router = useRouter();
  return (
    <div className="group relative flex flex-col rounded-xl bg-[#1a1a1e] border border-gray-700/80
                   overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2">
      
      {/* Image */}
      <div className="relative w-full h-48">
        <Image 
          src={course.image} 
          alt={course.title} 
          fill 
          className="object-cover" 
        />
        {/* Category Badge */}
        <span className="absolute top-3 right-3 bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
          {course.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-white mb-2 text-left">
          {course.title}
        </h3>
        <p className="text-sm text-gray-400 mb-6 text-left flex-grow min-h-[40px]">
          {course.description}
        </p>
        
        {/* Enroll Button */}
        <button 
          onClick={() => router.push(`/courses/${course.id}`)} // Example path
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md
                     hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
}


// (Unused CategoryButton component)
function CategoryButton({ text, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${color} text-white font-semibold py-3 px-6 rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out whitespace-nowrap`}
    >
      {text}
    </button>
  );
}