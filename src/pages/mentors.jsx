"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const mentors = [
  {
    name: "CA Rohan Mehta",
    title: "Direct Tax Expert",
    image: "https://i.pravatar.cc/150?img=12",
    specialization: "Direct Tax, Income Tax, Capital Gains",
    rating: 4.8,
    quote: "Taxation is not just compliance, it's strategy.",
    price: "₹25/min",
  },
  {
    name: "CA Sneha Verma",
    title: "Audit Mentor",
    image: "https://i.pravatar.cc/150?img=32",
    specialization: "Audit, Compliance, Risk Management",
    rating: 4.6,
    quote: "A good auditor sees what others overlook.",
    price: "₹20/min",
  },
  {
    name: "CA Karan Shah",
    title: "GST Specialist",
    image: "https://i.pravatar.cc/150?img=44",
    specialization: "GST, Indirect Tax, Business Structuring",
    rating: 4.7,
    quote: "Clarity in tax ensures clarity in business.",
    price: "₹22/min",
  },
  {
    name: "CA Nidhi Sinha",
    title: "Finance & Investment",
    image: "https://i.pravatar.cc/150?img=47",
    specialization: "Wealth Management, Investment Planning",
    rating: 5.0,
    quote: "Every rupee must know its job.",
    price: "₹30/min",
  },
  {
    name: "CA Manish Kapoor",
    title: "Accounts Guru",
    image: "https://i.pravatar.cc/150?img=51",
    specialization: "Accounting, MIS, Finalization",
    rating: 4.4,
    quote: "Behind every successful business is good accounting.",
    price: "₹18/min",
  },
  {
    name: "CA Sneha Goyal",
    title: "CMA & Costing Mentor",
    image: "https://i.pravatar.cc/150?img=57",
    specialization: "Costing, Budgeting, Management Accounting",
    rating: 4.9,
    quote: "Costing is the backbone of smart business decisions.",
    price: "₹24/min",
  },
];

function RenderStars({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
    else if (rating >= i - 0.5)
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
  }
  return <div className="flex justify-center gap-1 mt-1">{stars}</div>;
}

export default function MentorListPage() {
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState(mentors);
  const router = useRouter();

  useEffect(() => {
    const text = searchText.toLowerCase();
    setFiltered(
      mentors.filter(
        (m) =>
          m.name.toLowerCase().includes(text) ||
          m.specialization.toLowerCase().includes(text)
      )
    );
  }, [searchText]);

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      <Header />
      <section className="px-4 md:px-20 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Meet Our <span className="text-blue-500">Mentors</span>
        </h1>

        <div className="max-w-xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search by name or expertise..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-5 py-3 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"data-aos="fade-up" >
          {filtered.map((mentor) => (
            <div
              key={mentor.name}
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-700 rounded-3xl p-6 shadow-lg hover:scale-[1.02] hover:shadow-blue-500/40 transition-all flex flex-col justify-between"
            >
              {mentor.rating >= 4.8 && (
                <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                  ⭐ Top Mentor
                </span>
              )}

              <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                <Image
                  src={mentor.image}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold">{mentor.name}</h3>
                <p className="text-sm text-gray-400">{mentor.title}</p>
                <RenderStars rating={mentor.rating} />
                <p className="text-xs text-blue-300 mt-1 font-semibold">
                  {mentor.price}
                </p>
              </div>

              <blockquote className="mt-4 text-sm text-gray-300 italic text-center">
                “{mentor.quote}”
              </blockquote>

              <div className="mt-4 text-xs text-center flex flex-wrap justify-center gap-2">
                {mentor.specialization.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-700/30 text-blue-200 px-3 py-1 rounded-full shadow text-[11px]"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300">
                  Schedule Session
                </button>
                <button
                  className="border border-blue-500 text-blue-400 hover:bg-blue-800 hover:text-white px-5 py-2 rounded-full text-sm font-medium transition"
                  onClick={() => router.push("/mentorProfile")}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-400 text-sm mt-10">
            No mentors found matching your search.
          </p>
        )}
      </section>
    </div>
  );
}
