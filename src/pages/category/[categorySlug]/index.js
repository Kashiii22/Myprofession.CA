"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { contents, categories } from "../../../../data/dummyData";
import { sanityClient } from "../../../lib/sanityClient"; 

export async function getStaticPaths() {
  const paths = categories.map((cat) => ({ params: { categorySlug: cat.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { categorySlug } = params;

  const categoryQuery = `*[_type == "category" && slug.current == $slug][0]{_id}`;
  const category = await sanityClient.fetch(categoryQuery, { slug: categorySlug });

  if (!category) {
    return { notFound: true };
  }

  const contentQuery = `*[_type == "content" && category._ref == $categoryId]{
    _id,
    title,
    subtitle,
    author,
    createdAt,
    "slug": slug.current
  }`;

  const categoryContents = await sanityClient.fetch(contentQuery, { categoryId: category._id });

  return {
    props: {
      categorySlug,
      categoryContents: categoryContents || [],
    },
    revalidate: 60,
  };
}

export default function CategoryPage({ categorySlug, categoryContents }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredContents = categoryContents.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const paginatedContents = filteredContents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const allContents = Object.values(contents).flat();
  const upcomingFiles = allContents.slice(0, 5);

  const goToContentPage = (categorySlug, contentSlug) => {
    router.push(`/category/${categorySlug}/${contentSlug}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10 gap-6 flex">
        {/* Left Side Panels */}
        <aside className="w-80 flex flex-col gap-6">
          <div className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Upcoming Files</h2>
            <div className="vertical-marquee">
              <ul className="flex flex-col gap-2 text-xl">
                {upcomingFiles.concat(upcomingFiles).map((file, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-md hover:bg-gray-800 transition cursor-pointer"
                  >
                    {file.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-green-400 mb-4">
              Join as a Content Writer
            </h2>
            <p className="text-gray-300 mb-6 text-lg">
              Love writing about tax, finance & compliance?   
              Contribute your expertise to help thousands of readers.
            </p>
            <button
              onClick={() => router.push("/ApplyContentWriter")}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-md font-semibold text-white transition shadow-md text-lg"
            >
              Apply Now
            </button>
          </div>
        </aside>

        {/* Main Table */}
        <section className="flex-1 flex flex-col">
          <h1 className="text-5xl font-extrabold text-blue-400 mb-8">
            {categorySlug.replace("-", " ").toUpperCase()}
          </h1>

          <input
            type="text"
            placeholder="Search contents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-6 p-4 rounded-md bg-gray-900 border border-gray-700 text-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="overflow-x-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-700">
            <table className="min-w-full border-collapse border border-gray-700 text-lg">
              <thead>
                <tr className="bg-gray-800 text-xl">
                  {["Sr No.", "Topic", "Uploaded By", "Uploaded On", "File Type", "Action"].map(
                    (h, i) => (
                      <th
                        key={i}
                        className="px-6 py-4 text-left font-semibold text-gray-300 border-r border-gray-700 last:border-r-0"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedContents.map((c, idx) => (
                  <tr
                    key={idx}
                    className={`transition hover:bg-gray-800 cursor-pointer ${
                      idx % 2 === 0 ? "bg-gray-900" : "bg-gray-850"
                    }`}
                    onClick={() => goToContentPage(categorySlug, c.slug)}
                  >
                    <td className="px-6 py-4 border-r border-gray-700 text-lg">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-700 text-lg">
                      <div>
                        <div className="font-semibold text-blue-300">{c.title}</div>
                        {c.subtitle && (
                          // ✅ UPDATED: Changed 'text-gray-400' to 'text-white'
                          <div className="text-sm text-white mt-1">{c.subtitle}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-700 text-lg">{c.author || "Unknown"}</td>
                    <td className="px-6 py-4 border-r border-gray-700 text-lg">
                      {new Date(c.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-700 text-lg"> {(c.contentType || 'text').toUpperCase()}</td>
                    <td className="px-6 py-4 text-lg">
                      <button
                        className="px-5 py-3 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold transition text-lg"
                        onClick={(e) => {
                          e.stopPropagation();
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
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400 text-lg">
                      No matching contents.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-3 text-lg">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-md transition disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-5 py-3 rounded-md transition ${
                    currentPage === i + 1 ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-md transition disabled:opacity-50"
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