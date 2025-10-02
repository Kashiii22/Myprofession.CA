"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Import the router
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { sanityClient } from "../../../lib/sanityClient";
import { PortableText } from '@portabletext/react';
import { ptComponents } from "../../../components/PortableTextComponents";

export async function getStaticPaths() {
  const query = `*[_type == "content"]{
    "slug": slug.current,
    "categorySlug": category->slug.current
  }`;
  const allContents = await sanityClient.fetch(query);
  const paths = allContents.map((c) => ({
    params: { categorySlug: c.categorySlug, contentSlug: c.slug },
  }));
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { categorySlug, contentSlug } = params;
  
  const query = `*[_type == "content" && slug.current == $slug && category->slug.current == $categorySlug][0]{
    _id,
    title,
    author,
    createdAt,
    "slug": slug.current,
    sections[]{
      ...,
      description[]{
        ...,
        _type == "imageBlock" => {
          ...,
          asset->
        }
      }
    },
    documentsRequired[]{ 
      _key,
      documents
    }
  }`;

  const contentItem = await sanityClient.fetch(query, { slug: contentSlug, categorySlug });
  console.log("Fetched content item:", contentItem); // Debugging log 

  if (!contentItem) {
    return { notFound: true };
  }
  return {
    props: { contentItem },
    revalidate: 60,
  };
}

export default function CategoryPage({ contentItem }) {
  const router = useRouter(); // ✅ Initialize the router
  
  const articles = contentItem ? [contentItem] : [];
  const documents = useMemo(
    () => contentItem?.documentsRequired?.flatMap(docList => docList.documents) || [],
    [contentItem]
  );
  
  // ✅ State for the new global search input
  const [searchQuery, setSearchQuery] = useState("");

  const buildSelected = (item) => {
    if (!item) return null;
    return { type: "article", data: item, id: item.slug.current };
  };

  const [selectedItem, setSelectedItem] = useState(buildSelected(contentItem));
  const [openSections, setOpenSections] = useState({ articles: true, documents: true });
  
  // ✅ Local filtering logic ('searchTerm', 'filteredArticles', etc.) is removed as this is now a global search.

  useEffect(() => {
    setSelectedItem(buildSelected(contentItem));
  }, [contentItem]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ✅ New function to handle the global search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  const renderContent = (sections) => {
    if (!sections) return null;
    return sections.map((section, idx) => (
      <div key={idx} className="mb-8">
        <h2 className="text-3xl font-bold text-blue-400 mb-4">{section.title}</h2>
        {section.description && (
          <div className="portable-text-content text-gray-300 text-lg md:text-xl leading-relaxed font-sans">
            <PortableText value={section.description} components={ptComponents} />
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
      <Header />
      <main className="flex flex-col flex-1 container mx-auto px-4 py-8 gap-6">

        <div className="flex flex-1 gap-8">
          {/* Left Pane */}
          <aside className="w-80 flex-shrink-0 bg-gray-900 rounded-2xl p-4 border border-gray-700 shadow-lg self-start sticky top-8">
            <div className="overflow-y-auto h-[calc(100vh-6rem)] pr-2">
              
              <div>
                <button onClick={() => toggleSection("documents")} className="w-full text-left font-semibold text-yellow-400 mb-2 flex justify-between items-center text-2xl">
                  Documents Required ({documents.length}) {openSections.documents ? "▾" : "▸"}
                </button>
                {openSections.documents && (
                  <ul className="flex flex-col gap-2">
                    {documents.map((docName, idx) => (
                      <li key={idx} className="p-2 rounded-md text-xl text-gray-300 flex items-center gap-2">
                        <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {docName}
                      </li>
                    ))}
                    {documents.length === 0 && <li className="text-gray-400 p-2">No documents required.</li>}
                  </ul>
                )}
              </div>
              
              <div className="mb-4">
                <button onClick={() => toggleSection("articles")} className="w-full text-left font-semibold text-yellow-400 mb-2 flex justify-between items-center text-2xl">
                  Sub-Topic ({articles.length}) {openSections.articles ? "▾" : "▸"}
                </button>
                {openSections.articles && (
                  <ul className="flex flex-col gap-2">
                   {articles.map((a) => (
                     <li key={a.slug.current} className={`p-2 rounded-md cursor-pointer hover:bg-gray-800 transition text-xl ${selectedItem?.id === a.slug.current ? "bg-gray-800 border-l-4 border-blue-400" : ""}`}
                       onClick={() => setSelectedItem({ type: "article", data: a, id: a.slug.current })}>
                       {a.title}
                     </li>
                   ))}
                 </ul>
                )}
              </div>
            </div>
          </aside>
          
          {/* Right Pane */}
          <section className="flex-1 bg-gray-900 rounded-3xl p-8 shadow-lg">
            {selectedItem ? (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-6">
                  {selectedItem.data.title}
                </h1>
                <div>{renderContent(selectedItem.data.sections)}</div>
              </>
            ) : (
              <p className="text-gray-400 text-lg md:text-xl">
                Select an article from the left to view its content.
              </p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}