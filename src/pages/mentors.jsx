"use client";

import { useEffect, useState, memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  FaStar, FaStarHalfAlt, FaRegStar, FaUserGraduate, FaArrowRight, 
  FaFilter, FaSearch, FaUsers, FaDollarSign, FaClock, FaShieldAlt, 
  FaTimes, FaChevronDown, FaList, FaCheckCircle 
} from "react-icons/fa";
import { FiRefreshCw, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { getActiveMentors } from '@/lib/api/mentorApi';

// Categories for filtering
const categories = ["All", "IncomeTax", "GST", "Accounting", "Audit", "Investment", "Exam Oriented"];

// --- (RenderStars: No Change) ---
const RenderStars = memo(({ rating }) => (
  <div className="flex gap-1 justify-center text-lg">
    {[1, 2, 3, 4, 5].map((i) => {
      if (rating >= i) return <FaStar key={i} className="text-yellow-400" />;
      if (rating >= i - 0.5) return <FaStarHalfAlt key={i} className="text-yellow-400" />;
      return <FaRegStar key={i} className="text-yellow-400" />;
    })}
  </div>
));

// --- (MentorCard: Added Glow Effect) ---
const MentorCard = ({ mentor }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewProfile = (e) => {
    if (e) e.stopPropagation();
    router.push(`/mentor/${mentor.id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewProfile}
      className="relative cursor-pointer group w-full"
    >
      <div className="bg-gradient-to-br from-[#0D1117] via-slate-900 to-black border border-blue-600/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50">
        
        {/* Card Header */}
        <div className="relative h-48 p-6 border-b border-blue-800/30">
          <div className="absolute top-4 right-4 z-10">
            {mentor.verified && (
              // ✅ ADDED a subtle glow to build trust
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center shadow-lg shadow-green-500/30">
                <FaShieldAlt className="mr-1" />
                Verified
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-20 h-20">
              <Image
                src={mentor.image} 
                alt={mentor.name}
                fill
                className="object-cover rounded-full border-4 border-blue-500 shadow-lg"
                sizes="80px"
              />
              {mentor.rating >= 4.8 && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  ⭐
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{mentor.name}</h3>
              <p className="text-sm text-blue-400 line-clamp-1">{mentor.title}</p>
              <div className="flex items-center gap-2">
                <RenderStars rating={mentor.rating} />
                <span className="text-gray-400 text-xs">({mentor.rating})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Stats */}
        <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-blue-800/20">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <FaClock className="text-blue-500 mx-auto" />
              <div className="text-white font-bold text-sm mt-1">{mentor.sessionsCompleted || 0}</div>
              <div className="text-gray-400 text-xs">Sessions</div>
            </div>
            <div className="text-center">
              <FaDollarSign className="text-green-500 mx-auto" />
              <div className="text-white font-bold text-sm mt-1">₹{mentor.pricePerMinute}</div>
              <div className="text-gray-400 text-xs">Per min</div>
            </div>
            <div className="text-center">
              <FaUserGraduate className="text-purple-500 mx-auto" />
              <div className="text-white font-bold text-sm mt-1">{mentor.experience || '5+'}</div>
              <div className="text-gray-400 text-xs">Years</div>
            </div>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="p-4">
          <div className="flex flex-wrap justify-center gap-2">
            {mentor.specialization?.split(",").slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-blue-800/30 text-blue-300 px-3 py-1 rounded-full border border-blue-700 text-xs font-medium">
                {tag.trim()}
              </span>
            ))}
            {mentor.specialization?.split(",").length > 3 && (
              <span className="bg-gray-700/30 text-gray-400 px-3 py-1 rounded-full text-xs">
                +{mentor.specialization.split(",").length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-4 pb-6">
          <button 
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:to-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-xl"
            onClick={handleViewProfile}
          > 
            <span className="text-sm">View Details & Book</span>
          </button> 
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
          isHovered ? 'ring-2 ring-blue-400/50 ring-inset ring-blue-600/20' : ''
        }`} />
      </div>
    </motion.div>
  );
};


// --- ✅ Main Page ---
export default function MentorListPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const [sortOrder, setSortOrder] = useState("desc");
  const [allMentors, setAllMentors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- (Data Fetching: Unchanged) ---
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getActiveMentors();
        if (!result.success) throw new Error(result.message || 'Failed to fetch mentors');

        const transformedMentors = result.data.map(mentor => ({
          id: mentor._id,
          name: mentor.userRef.name,
          image: mentor.userRef.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
          title: mentor.registrationRef?.qualification?.[0] || 'Professional Mentor',
          rating: mentor.rating || 4.5,
          specialization: mentor.registrationRef?.expertise?.join(', ') || 'General',
          sessionsCompleted: mentor.sessionsCompleted || 0,
          pricePerMinute: mentor.hourlyRate ? 
            Math.round(parseInt(String(mentor.hourlyRate).replace(/[^\d]/g, '')) / 60) : 30,
          experience: mentor.registrationRef?.yearsOfExperience || "5+",
          verified: mentor.registrationRef?.verificationStatus === 'verified',
        }));

        setAllMentors(transformedMentors);
        setFiltered(transformedMentors);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentors();
  }, []);

  // --- (Filtering Logic: Unchanged) ---
  useEffect(() => {
    const text = searchText.trim().toLowerCase();
    let filteredList = allMentors.filter(({ name, specialization }) => {
      const matchText = name.toLowerCase().includes(text) || specialization.toLowerCase().includes(text);
      const matchCategory = selectedCategory === "All" || specialization.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchText && matchCategory;
    });

    const sortMentors = {
      desc: () => filteredList.sort((a, b) => b.rating - a.rating),
      asc: () => filteredList.sort((a, b) => a.rating - b.rating),
      az: () => filteredList.sort((a, b) => a.name.localeCompare(b.name)),
      za: () => filteredList.sort((a, b) => b.name.localeCompare(a.name)),
    };
    if (sortMentors[sortOrder]) sortMentors[sortOrder]();

    setFiltered(filteredList);
  }, [searchText, selectedCategory, sortOrder, allMentors]);


  // --- Select Input Style ---
  const selectClass = "w-full md:w-auto bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />

      {/* --- ✅ NEW: Sticky Filter Bar --- */}
      {/* This is the only thing between the header and the mentors */}
      {/* It's sticky, so it scrolls with the user */}
      <section className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-gray-800 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* 1. Search Bar (Main action) */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by name, expertise..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* 2. Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={selectClass}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
              ))}
            </select>

            {/* 3. Sort By Filter */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={selectClass}
            >
              <option value="desc">Sort by: Rating (High to Low)</option>
              <option value="asc">Sort by: Rating (Low to High)</option>
              <option value="az">Sort by: Name (A-Z)</option>
              <option value="za">Sort by: Name (Z-A)</option>
            </select>

          </div>
        </div>
      </section>

      {/* --- ✅ Mentor Cards Grid --- */}
      {/* This is now the first main content block on the page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-lg text-gray-400">
            Showing <span className="text-white font-bold">{filtered.length}</span>
            <span className="text-blue-400 font-medium"> {selectedCategory === "All" ? "Experts" : selectedCategory} </span>
            {searchText && <>matching "<span className="text-white font-medium">{searchText}</span>"</>}
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center gap-4 text-lg text-gray-400 py-20">
            <FiLoader className="animate-spin text-4xl text-blue-500" />
            <span className="text-lg">Loading mentors...</span>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-2xl max-w-md">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h2 className="text-red-400 text-xl font-bold mb-3">Unable to Load</h2>
              <p className="text-red-300">Please try refreshing the page</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <AnimatePresence>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-20 border border-gray-800 rounded-2xl">
            <div className="text-gray-500 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No mentors found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}