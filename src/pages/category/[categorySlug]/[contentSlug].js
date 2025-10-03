"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { sanityClient } from "../../../lib/sanityClient";
import { PortableText } from '@portabletext/react';
import { ptComponents } from "../../../components/PortableTextComponents";

// --- DATA FETCHING (No changes needed) ---
export async function getStaticPaths() {
  const query = `*[_type == "content"]{
    "slug": slug.current,
    "categorySlug": category->slug.current
  }`;
  const allContents = await sanityClient.fetch(query);
  const paths = allContents
    .filter(c => c.categorySlug && c.slug)
    .map((c) => ({
      params: { categorySlug: c.categorySlug, contentSlug: c.slug },
    }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const { categorySlug, contentSlug } = params;
  const contentQuery = `*[_type == "content" && slug.current == $slug && category->slug.current == $categorySlug][0]{
    ..., "slug": slug.current,
    sections[]{
      ..., description[]{..., _type in ["image", "imageBlock"] => { asset-> }}
    }
  }`;
  const contentItem = await sanityClient.fetch(contentQuery, { slug: contentSlug, categorySlug });
  console.log("Fetched contentItem:", contentItem);
  if (!contentItem) return { notFound: true };
  return {
    props: { contentItem },
    revalidate: 60,
  };
}
// --- END OF DATA FETCHING ---


export default function CategoryPage({ contentItem }) {
  const router = useRouter(); 
  // ✨ "isContentVisible" state is removed
  const [openSections, setOpenSections] = useState({ documents: true, topic: true });
  const [activeSection, setActiveSection] = useState('');
  
  const documents = useMemo(() => contentItem?.documentsRequired?.flatMap(docList => docList.documents) || [], [contentItem]);
  const selectedItem = { type: "article", data: contentItem, id: contentItem.slug };
  
  const toggleSection = (section) => setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  // This useEffect now runs as soon as the component mounts
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -70% 0px" }
    );
    const sections = selectedItem.data.sections || [];
    sections.forEach(section => {
      const id = section.title.toLowerCase().replace(/\s+/g, '-');
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => sections.forEach(section => {
      const id = section.title.toLowerCase().replace(/\s+/g, '-');
      const el = document.getElementById(id);
      if (el) observer.unobserve(el);
    });
  }, [selectedItem.data.sections]); // ✨ Dependency updated

  // ✨ New useEffect to automatically scroll to the first topic
  useEffect(() => {
    const sections = selectedItem.data.sections || [];
    if (sections.length > 0) {
        const firstSectionId = sections[0].title.toLowerCase().replace(/\s+/g, '-');
        // A small timeout ensures the page has rendered before we try to scroll
        setTimeout(() => {
            const element = document.getElementById(firstSectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
  }, [selectedItem.data.sections]);


  const handleSectionClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderContent = (sections) => {
    if (!sections) return null;
    return sections.map((section) => {
      const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
      return (
        <div key={sectionId} id={sectionId} className="mb-8 scroll-mt-24">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">{section.title}</h2>
          {section.description && (
            <div className="portable-text-content text-lg md:text-xl leading-relaxed font-sans">
              <PortableText value={section.description} components={ptComponents} />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
      <Header />
      <main className="flex flex-col flex-1 container mx-auto px-4 py-8 gap-6">
        <div className="flex flex-1 gap-8">
          <aside className="w-80 flex-shrink-0 bg-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg self-start sticky top-8">
            <div className="overflow-y-auto h-[calc(100vh-8rem)] pr-2">
              <h2 className="text-2xl font-bold text-white mb-1">{selectedItem.data.title}</h2>
              <p className="text-sm text-gray-400 mb-6 border-b border-gray-700 pb-4">Article Contents</p>
              
              {documents.length > 0 && (
                <div className="mb-6">
                  <button onClick={() => toggleSection("documents")} className="w-full text-left font-semibold text-yellow-400 mb-3 flex justify-between items-center text-xl">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Documents Required
                    </div>
                    <span>{openSections.documents ? "▾" : "▸"}</span>
                  </button>
                  {openSections.documents && (
                    <ul className="flex flex-col gap-2 text-gray-300">
                      {documents.map((docName, idx) => (
                        <li key={idx} className="pl-4 text-lg flex items-center gap-3">
                          <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          {docName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {/* ✨ "Topic" section is now always visible */}
              {selectedItem.data.sections && (
                <div className="mb-6">
                  <button onClick={() => toggleSection("topic")} className="w-full text-left font-semibold text-yellow-400 mb-3 flex justify-between items-center text-xl">
                    <div className="flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                       Topic
                    </div>
                     <span>{openSections.topic ? "▾" : "▸"}</span>
                  </button>
                  {openSections.topic && (
                    <ul className="flex flex-col text-lg">
                      {selectedItem.data.sections.map((section) => {
                        const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
                        return (
                          <li key={sectionId}>
                            <button
                              onClick={() => handleSectionClick(sectionId)}
                              className={`w-full text-left py-2 px-4 border-l-4 transition-colors duration-200 ${
                                activeSection === sectionId 
                                ? "border-blue-400 bg-blue-400/10 text-blue-300 font-semibold" 
                                : "border-transparent text-gray-400 hover:text-white hover:border-gray-500"
                              }`}
                            >
                              {section.title}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </aside>
          
          <section className="flex-1 bg-gray-900 rounded-3xl p-8 shadow-lg">
            {selectedItem ? (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-2">{selectedItem.data.title}</h1>
                {selectedItem.data.subtitle && <p className="text-2xl text-gray-300 mb-8 italic">{selectedItem.data.subtitle}</p>}
                
                {/* ✨ Content is now rendered directly, no button */}
                <div>{renderContent(selectedItem.data.sections)}</div>
              </>
            ) : (<p>Loading Content...</p>)}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}