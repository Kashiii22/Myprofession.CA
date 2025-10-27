"use client";

import { useEffect, useState, memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["IncomeTax", "GST", "Accounting", "Audit", "Investment", "Exam Oriented" ];

const mentors = [
];

const RenderStars = memo(({ rating }) => (
  <div className="flex justify-center gap-1 mt-2 text-xl">
    {[1, 2, 3, 4, 5].map((i) => {
      if (rating >= i) return <FaStar key={i} className="text-yellow-400" />;
      if (rating >= i - 0.5) return <FaStarHalfAlt key={i} className="text-yellow-400" />;
      return <FaRegStar key={i} className="text-yellow-400" />;
    })}
  </div>
));

const MentorCard = ({ mentor }) => {
  const router = useRouter();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={() => router.push("/mentorProfile")}
      className="cursor-pointer relative w-full bg-[#0D1117] border border-blue-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] hover:shadow-blue-500/30 transition-all flex flex-col justify-between mx-auto sm:max-w-[300px]"
    >
      {mentor.rating >= 4.8 && (
        <span className="absolute top-4 right-4 bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-sm">
          ⭐ Top Mentor
        </span>
      )}

      <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
        <Image src={mentor.image} alt={mentor.name} fill className="object-cover" sizes="112px" />
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold text-white">{mentor.name}</h3>
        <p className="text-base text-gray-400">{mentor.title}</p>
        <RenderStars rating={mentor.rating} />
      </div>

      <div className="mt-4 text-sm text-center flex flex-wrap justify-center gap-2">
        {mentor.specialization.split(",").map((tag, i) => (
          <span
            key={i}
            className="bg-blue-800/30 text-blue-300 px-3 py-1 rounded-full border border-blue-500 shadow font-medium"
          >
            {tag.trim()}
          </span>
        ))}
      </div>

<div className="mt-6 flex justify-center"> <button className="border border-blue-500 text-blue-400 hover:bg-blue-800 hover:text-white px-6 py-2 rounded-full text-base font-medium transition" onClick={() => router.push("/mentorProfile")} > View </button> </div>
    </motion.div>
  );
};


export default function MentorListPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [sortOrder, setSortOrder] = useState("");
  const [filtered, setFiltered] = useState(mentors);

  useEffect(() => {
    const text = searchText.trim().toLowerCase();
    let filteredList = mentors.filter(({ name, specialization }) => {
      const matchText = name.toLowerCase().includes(text) || specialization.toLowerCase().includes(text);
      const matchCategory = selectedCategories.includes("All") || selectedCategories.some((cat) => specialization.toLowerCase().includes(cat.toLowerCase()));
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
  }, [searchText, selectedCategories, sortOrder]);

  const resetFilters = () => {
    setSearchText("");
    setSelectedCategories(["All"]);
    setSortOrder("");
  };

  return (
    <div className="bg-black min-h-screen text-white font-['Outfit'] text-[17px] sm:text-[18px]">
      <Header />

      <section className="px-5 sm:px-10 md:px-20 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          <span className="text-blue-500">Meet</span> <i>Our Mentors</i>
        </h1>

        {/* Search & Filter */}
        <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex w-full gap-2">
            <input
              type="text"
              placeholder="Search by name or expertise..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-base"
            />
            {(searchText || !selectedCategories.includes("All") || sortOrder !== "") && (
              <button
                onClick={resetFilters}
                className="p-3 bg-gray-800 border border-gray-600 rounded-full text-blue-400 hover:text-white hover:bg-blue-700 transition-all"
                title="Reset Filters"
              >
                <FiRefreshCw size={20} />
              </button>
            )}
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="" disabled>Sort by</option>
            <option value="desc">High to Low</option>
            <option value="asc">Low to High</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                if (cat === "All") {
                  setSelectedCategories(["All"]);
                } else {
                  setSelectedCategories((prev) => {
                    const updated = prev.includes(cat)
                      ? prev.filter((c) => c !== cat)
                      : [...prev.filter((c) => c !== "All"), cat];
                    return updated.length === 0 ? ["All"] : updated;
                  });
                }
              }}
              className={`px-4 py-2 rounded-full border text-base font-medium transition-all duration-300 shadow-md ${
                selectedCategories.includes(cat)
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-blue-900 text-blue-300 border-blue-700 hover:bg-blue-800 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mentor Cards */}
        <AnimatePresence mode="wait">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((mentor) => (
              <MentorCard key={mentor.name} mentor={mentor} />
            ))}
          </div>
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-lg mt-10">
            No mentors found matching your criteria.
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}
