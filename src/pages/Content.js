"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  CheckCircle,
  Newspaper,
  Clock,
  Search,
  Tag,
} from "lucide-react";

const filters = [
  { key: "All", label: "All", icon: <Newspaper className="w-4 h-4" /> },
  { key: "Guide", label: "Guides", icon: <FileText className="w-4 h-4" /> },
  { key: "Template", label: "Templates", icon: <FileSpreadsheet className="w-4 h-4" /> },
  { key: "Article", label: "Articles", icon: <Newspaper className="w-4 h-4" /> },
];

const contentData = [
  {
    type: "Guide",
    title: "How to File ITR-1 Online",
    desc: "Step-by-step guide for salaried individuals filing ITR-1.",
    link: "/content/itr-1-guide",
    meta: "Updated Jan 2025 · 5 min read",
    tags: ["ITR", "Salaried"],
  },
  {
    type: "Guide",
    title: "Common ITR Mistakes",
    desc: "Avoid the most common mistakes taxpayers make.",
    link: "/content/itr-mistakes",
    meta: "Updated Jan 2025 · 7 min read",
    tags: ["ITR", "Mistakes"],
  },
  {
    type: "Template",
    title: "ITR-2 Excel Template",
    desc: "Ready-to-use Excel template for quick ITR-2 filing.",
    link: "/templates/itr-2",
    meta: "Excel · 150KB · Updated Dec 2024",
    tags: ["ITR", "Excel"],
  },
  {
    type: "Template",
    title: "Advance Tax Calculator (Excel)",
    desc: "Simple calculator template for advance tax computation.",
    link: "/templates/advance-tax",
    meta: "Excel · 120KB · Updated Nov 2024",
    tags: ["Tax", "Calculator"],
  },
  {
    type: "Article",
    title: "ITR Filing Deadlines 2025",
    desc: "Stay updated with important ITR filing deadlines.",
    link: "/content/itr-deadlines",
    meta: "Published Feb 2025",
    tags: ["ITR", "Deadlines"],
  },
  {
    type: "Article",
    title: "Tax Benefits on Home Loans",
    desc: "Understand the latest deductions available on home loan interest & principal.",
    link: "/content/home-loan-benefits",
    meta: "Published Jan 2025",
    tags: ["HomeLoan", "Deductions"],
  },
  // Add more items for testing pagination...
];

// Upcoming Articles Data
const upcomingArticles = [
  { title: "Understanding the New Tax Regime vs Old Regime", eta: "Coming March 2025" },
  { title: "TDS on Freelancers Explained", eta: "Coming April 2025" },
];

export default function DomainDataPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTag, setActiveTag] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

  // Filter logic
  const filtered = contentData.filter((c) => {
    const matchesType = activeFilter === "All" || c.type === activeFilter;
    const matchesTag = !activeTag || c.tags.includes(activeTag);
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesTag && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Extract all unique tags
  const allTags = [...new Set(contentData.flatMap((c) => c.tags))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Income Tax</h1>
          <p className="text-gray-600 text-sm">
            All guides, templates, and required documents for smooth ITR filing.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="space-y-6 h-fit sticky top-6">
          {/* Docs Required */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              📑 Documents Required
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {["PAN Card", "Aadhaar Card", "Form 16", "Bank Statement", "Investment Proofs"].map(
                (doc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" /> {doc}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Upcoming Articles */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Upcoming Articles
            </h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {upcomingArticles.map((item, i) => (
                <li key={i} className="border-b last:border-0 pb-2 last:pb-0">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <span className="text-xs text-gray-500">{item.eta}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-3">
          {/* Search */}
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search guides, templates, or articles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6 border-b pb-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setActiveFilter(f.key);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                  activeFilter === f.key
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Tag className="w-4 h-4 text-gray-500" />
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTag(activeTag === t ? null : t);
                  setPage(1);
                }}
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  activeTag === t
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "text-gray-600 hover:bg-gray-100 border-gray-300"
                }`}
              >
                #{t}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((item, idx) => (
              <ContentCard key={idx} {...item} />
            ))}
            {paginated.length === 0 && (
              <p className="text-sm text-gray-500">No results found.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ContentCard({ type, title, desc, link, meta }) {
  const typeStyles =
    type === "Guide"
      ? "bg-blue-100 text-blue-700"
      : type === "Template"
      ? "bg-green-100 text-green-700"
      : "bg-purple-100 text-purple-700";

  return (
    <div className="bg-white border rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between">
      <div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeStyles}`}
        >
          {type}
        </span>
        <h3 className="text-base font-semibold text-gray-800 mt-3 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{desc}</p>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{meta}</span>
        <a
          href={link}
          className="text-blue-600 font-medium hover:underline text-sm"
        >
          {type === "Template" ? "Download →" : "Read More →"}
        </a>
      </div>
    </div>
  );
}
