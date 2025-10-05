"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { contents } from "../../../../data/dummyData"; // Removed unused 'categories'
import { sanityClient } from "../../../lib/sanityClient";
import { FaEye } from "react-icons/fa";

// --- DATA FETCHING (No changes needed here) ---
export async function getStaticPaths() {
    const query = `*[_type == "category"]{"slug": slug.current}`;
    const allCategories = await sanityClient.fetch(query);
    const paths = allCategories
        .filter(cat => cat.slug)
        .map((cat) => ({ params: { categorySlug: cat.slug } }));
    return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    const { categorySlug } = params;
    const categoryQuery = `*[_type == "category" && slug.current == $slug][0]{_id, title}`;
    const category = await sanityClient.fetch(categoryQuery, { slug: categorySlug });
    if (!category) { return { notFound: true }; }

    const contentQuery = `*[_type == "content" && references($categoryId)] | order(createdAt desc) {
        _id,
        title,
        subtitle,
        "authorName": author,
        createdAt,
        contentType,
        "slug": slug.current
    }`;
    const categoryContents = await sanityClient.fetch(contentQuery, { categoryId: category._id });

    return {
        props: {
            categoryTitle: category.title,
            categorySlug,
            categoryContents: categoryContents || [],
        },
        revalidate: 60,
    };
}
// --- END OF DATA FETCHING ---

export default function CategoryPage({ categoryTitle, categorySlug, categoryContents }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter, then paginate the contents
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

    const goToContentPage = (contentSlug) => {
        router.push(`/category/${categorySlug}/${contentSlug}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
            <Header />
            {/* MODIFICATION: Removed 'flex' and 'gap-8' for full-width layout */}
            <main className="flex-1 container mx-auto px-6 py-10">
                
                {/* MODIFICATION: The entire <aside> block has been removed */}

                <section className="flex flex-col">
                    <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
                        {categoryTitle || categorySlug.replace("-", " ").toUpperCase()}
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
                                                // MODIFICATION: Updated classes for more readable headers
                                                className="px-6 py-3 text-left text-sm font-bold text-slate-800"
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
                                        onClick={() => goToContentPage(c.slug)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {(currentPage - 1) * itemsPerPage + idx + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-indigo-700">{c.title}</div>
                                            {c.subtitle && (<div className="text-sm text-slate-500 mt-1">{c.subtitle}</div>)}
                                            
                                            {/* MODIFICATION: Removed the time to read / live readers div */}
                                            
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{c.authorName || "Admin"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
                                                {(c.contentType || 'text').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                className="animated-view-button"
                                                onClick={(e) => { e.stopPropagation(); goToContentPage(c.slug); }}
                                            >
                                                <FaEye />
                                                <span>View</span>
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
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                           <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-white border border-slate-300 rounded-md transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                             Prev
                           </button>
                           {[...Array(totalPages)].map((_, i) => (
                             <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 rounded-md transition ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-white border border-slate-300 hover:bg-slate-100"}`}>
                               {i + 1}
                             </button>
                           ))}
                           <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-white border border-slate-300 rounded-md transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                             Next
                           </button>
                        </div>
                    )}
                </section>
            </main>
            
            <style jsx>{`
                .animated-view-button {
                    position: relative;
                    overflow: hidden;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.2rem;
                    border: none;
                    background: linear-gradient(to right, #4f46e5, #6366f1);
                    color: white;
                    font-weight: 600;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px 0 rgba(79, 70, 229, 0.4);
                    animation: pulse-glow 2.5s infinite ease-in-out;
                }
                .animated-view-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px 0 rgba(79, 70, 229, 0.5);
                }
                .animated-view-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    animation: shine 4s infinite linear;
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 4px 15px 0 rgba(79, 70, 229, 0.4); }
                    50% { box-shadow: 0 4px 25px 0 rgba(99, 102, 241, 0.6); }
                }
                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                /* CSS for 'live-dot' is no longer needed but kept in case you reuse it */
                .live-dot {
                    width: 7px;
                    height: 7px;
                    background-color: #ef4444;
                    border-radius: 50%;
                    animation: pulse-live 1.5s infinite;
                }
                @keyframes pulse-live {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.9); }
                }
            `}</style>
            
            <Footer />
        </div>
    );
}