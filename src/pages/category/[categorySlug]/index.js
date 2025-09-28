"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { contents, categories } from "../../../../data/dummyData";

export async function getStaticPaths() {
  const paths = categories.map((cat) => ({ params: { categorySlug: cat.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const categoryContents = contents[params.categorySlug] || [];
  return { props: { categorySlug: params.categorySlug, categoryContents } };
}

export default function CategoryPage({ categorySlug, categoryContents }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredContents = categoryContents.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const paginatedContents = filteredContents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Sample data for side panels
  const allContents = Object.values(contents).flat();
  const upcomingFiles = allContents.slice(0, 5);
  const incomeTaxTips = [
    "Keep track of all deductions.",
    "Invest in tax-saving instruments.",
    "File your returns on time.",
    "Maintain all invoices and receipts.",
    "Check eligibility for rebates under section 87A."
  ];

  // Function to navigate to content page
  const goToContentPage = (categorySlug, contentSlug) => {
    router.push(`/category/${categorySlug}/${contentSlug}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 gap-6 flex">
        {/* Left Side Panels */}
        <aside className="w-80 flex flex-col gap-6">
          {/* Upcoming Files Box */}
          <div className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold text-blue-400 mb-4">Upcoming Files</h2>
            <ul className="flex flex-col gap-2">
              {upcomingFiles.map((file, idx) => (
                <li key={idx} className="p-2 rounded-md hover:bg-gray-800 transition cursor-pointer">
                  {file.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Income Tax Tips Box */}
          <div className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Income Tax Tips</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {incomeTaxTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Table */}
        <section className="flex-1 flex flex-col">
          <h1 className="text-4xl font-extrabold text-blue-400 mb-6">
            {categorySlug.replace("-", " ").toUpperCase()}
          </h1>

          <input
            type="text"
            placeholder="Search contents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-6 p-3 rounded-md bg-gray-900 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="overflow-x-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Sr NO.</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Uploaded On</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Topic</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">File Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {paginatedContents.map((c, idx) => (
                  <tr
                    key={idx}
                    className={`transition hover:bg-gray-800 cursor-pointer ${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-850"}`}
                    onClick={() => goToContentPage(categorySlug, c.slug)}
                  >
                    <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-6 py-4">{c.uploadedOn || "N/A"}</td>
                    <td className="px-6 py-4 font-semibold text-blue-300">{c.title}</td>
                    <td className="px-6 py-4">{c.contentType.toUpperCase()}</td>
                    <td className="px-6 py-4">{c.author || "Unknown"}</td>
                    <td className="px-6 py-4">
                      <button
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold transition"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent row click
                          goToContentPage(categorySlug, c.slug);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedContents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      No matching contents.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-md transition ${
                    currentPage === i + 1 ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
