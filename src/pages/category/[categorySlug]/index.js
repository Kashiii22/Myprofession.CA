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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10 gap-8 flex">
        {/* Left Side Panels */}
        <aside className="w-80 flex flex-col gap-8">
          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Upcoming Files</h2>
            <div className="vertical-marquee">
              <ul className="flex flex-col gap-2 text-lg">
                {upcomingFiles.concat(upcomingFiles).map((file, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-md hover:bg-slate-100 transition cursor-pointer font-medium"
                  >
                    {file.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-teal-600 mb-4">
              Join as a Content Writer
            </h2>
            <p className="text-slate-600 mb-6">
              Love writing about tax, finance & compliance? Contribute your expertise to help thousands of readers.
            </p>
            <button
              onClick={() => router.push("/ApplyContentWriter")}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-md font-semibold text-white transition shadow-sm text-md"
            >
              Apply Now
            </button>
          </div>
        </aside>

        {/* Main Table */}
        <section className="flex-1 flex flex-col">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
            {categorySlug.replace("-", " ").toUpperCase()}
          </h1>

          <input
            type="text"
            placeholder="Search within this category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-6 p-3 rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-slate-200">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  {["Sr No.", "Topic", "Uploaded By", "Uploaded On", "File Type", "Action"].map(
                    (h, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedContents.map((c, idx) => (
                  <tr
                    key={c._id}
                    className="transition hover:bg-slate-50 cursor-pointer"
                    onClick={() => goToContentPage(categorySlug, c.slug)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-indigo-700">{c.title}</div>
                        {c.subtitle && (
                          <div className="text-sm text-slate-500 mt-1">{c.subtitle}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{c.author || "Unknown"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(c.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                         {(c.contentType || 'text').toUpperCase()}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold text-white transition shadow-sm text-sm"
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
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                      No matching content found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-300 rounded-md transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-md transition ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-slate-300 rounded-md transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
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