"use client";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { ArrowDownToLine, Flame } from "lucide-react";

const categories = ["GST", "Income Tax", "ROC"];

export default function ConsultingPage() {
  const [selectedCategory, setSelectedCategory] = useState("GST");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [files, setFiles] = useState([]);
  const filesPerPage = 5;

  // Generate dummy files on client-side only
  useEffect(() => {
    const dummyFiles = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Sample Form ${i + 1}`,
      category: i % 2 === 0 ? "GST" : i % 3 === 0 ? "ROC" : "Income Tax",
      downloads: Math.floor(Math.random() * 500),
      fileUrl: `/forms/sample-${i + 1}.pdf`,
      shortDesc: "Quick summary of the form purpose.",
      fullDesc:
        "Detailed description of the form, its compliance use cases, and instructions for filling it out correctly.",
      isNew: i > 20, // last 5 files marked as new
    }));
    setFiles(dummyFiles);
  }, []);

  // Filter files
  const filteredFiles = files.filter(
    (file) =>
      file.category === selectedCategory &&
      file.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);
  const startIndex = (currentPage - 1) * filesPerPage;
  const currentFiles = filteredFiles.slice(
    startIndex,
    startIndex + filesPerPage
  );

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-700 to-indigo-500 py-12 shadow-lg">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-extrabold mb-4">
            One-stop Library for GST, ITR & ROC Forms
          </h2>
          <p className="text-gray-200 text-lg">
            100% Free & Regularly Updated. Search, filter, and download
            compliance forms instantly — stay ahead with ease.
          </p>
        </div>
      </section>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-4 justify-center flex-wrap gap-y-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1); // reset pagination
              }}
              className={`px-5 py-2 rounded-full font-medium transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <input
          type="text"
          placeholder="Search forms (e.g. ITR-1, GST-3B)..."
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset pagination
          }}
        />
      </div>

      {/* File List */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pb-12 w-full">
        {currentFiles.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-lg">
            <table className="min-w-full border-collapse text-sm md:text-base">
              <thead className="bg-gray-900 text-gray-400">
                <tr>
                  <th className="p-4 text-left">File Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4">Details</th>
                  <th className="p-4 text-center">View Content</th> {/* New Column */}
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                  >
                    <td className="p-4 font-medium flex items-center gap-2">
                      {file.title}
                      {file.isNew && (
                        <span className="px-2 py-0.5 text-xs bg-green-600 text-white rounded-full">
                          New
                        </span>
                      )}
                      {file.downloads > 300 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-orange-600 text-white rounded-full">
                          <Flame size={14} /> Popular
                        </span>
                      )}
                    </td>
                    <td className="p-4">{file.category}</td>
                    <td className="p-4 font-semibold text-indigo-400">
                      {file.downloads.toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-300">
                      <p className="italic">{file.shortDesc}</p>
                      <p className="text-xs text-gray-500 mt-1">{file.fullDesc}</p>
                    </td>
                    <td className="p-4 text-center">
                      <a
                        href={`/forms/content/${file.id}`} // Link to file content page
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm shadow transition"
                      >
                        View Content
                      </a>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={file.fileUrl}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow transition text-sm"
                      >
                        <ArrowDownToLine size={16} />
                        Download
                      </a>
                      <p className="text-xs text-gray-400 mt-1">Free</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400">No files found.</p>
        )}

        {/* Marketing note */}
        <div className="mt-6 text-center text-gray-400 text-sm italic">
          🚀 New forms added every week. Bookmark this page to never miss the
          latest updates.
        </div>

        {/* Pagination */}
        {filteredFiles.length > filesPerPage && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          © {new Date().getFullYear()} MyProfession.CA. All rights reserved. | Powered with ❤️ for
          professionals.
        </div>
      </footer>
    </div>
  );
}
