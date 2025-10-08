"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { sanityClient } from "../../../lib/sanityClient";
import { PortableText } from '@portabletext/react';
import { ptComponents } from "../../../components/PortableTextComponents";
import { FiClock, FiFileText } from "react-icons/fi";
import { FaChevronRight } from "react-icons/fa";

// --- DATA FETCHING ---
export async function getStaticPaths() {
    const query = `*[_type == "content"]{ "slug": slug.current, "categorySlug": category->slug.current }`;
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
    
    // ✅ CORRECTED QUERY: Simplified the table cell projection to fetch simple strings.
    const contentQuery = `*[_type == "content" && slug.current == $slug && category->slug.current == $categorySlug][0]{
        ..., 
        "slug": slug.current,
        "authorName": author->name,
        "attachmentURL": attachment.asset->url,
        "attachmentFileName": attachment.asset->originalFilename,
        sections[]{
            ..., 
            description[]{
                ..., 
                _type in ["image", "imageBlock"] => { asset-> },
                _type == "attachment" => { "fileURL": asset->url, "fileName": asset->originalFilename },
                
                _type == "table" => {
                    _key,
                    _type,
                    rows[]{
                        _key,
                        cells // 🌟 FIX: Fetch the 'cells' field directly (it contains the string array).
                    }
                },

                markDefs[]{
                    ...,
                    _type == "internalLink" => {
                        "slug": @.reference->slug.current,
                        "categorySlug": @.reference->category->slug.current
                    }
                }
            }
        }
    }`;
    
    const contentItem = await sanityClient.fetch(contentQuery, { slug: contentSlug, categorySlug });
    // You should use util.inspect here to log deeply, but sticking to console.log:
    // This will now correctly log the strings inside the cells array if the GROQ works.
    console.log("Fetched contentItem:", contentItem); 
    
    if (!contentItem) {
        return { notFound: true };
    }
    
    return {
        props: { contentItem },
        revalidate: 60,
    };
}
// --- END OF DATA FETCHING ---

export default function CategoryPage({ contentItem }) {
    const router = useRouter(); 
    const [openSections, setOpenSections] = useState({ documents: false, topic: false });
    const [activeSection, setActiveSection] = useState('');
    
    const headerRef = useRef(null);
    
    const documents = useMemo(() => contentItem?.documentsRequired?.flatMap(docList => docList.documents) || [], [contentItem]);
    const validSections = useMemo(() => contentItem?.sections?.filter(section => section && section.title) || [], [contentItem]);

    const [pillStyle, setPillStyle] = useState({ top: 0, height: 0, opacity: 0 });
    const topicRefs = useRef([]);
    const topicsListRef = useRef(null);
    
    const toggleSection = (section) => setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            }, { rootMargin: "-30% 0px -70% 0px" }
        );

        validSections.forEach(section => {
            const id = section.title.toLowerCase().replace(/\s+/g, '-');
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => validSections.forEach(section => {
            const id = section.title.toLowerCase().replace(/\s+/g, '-');
            const el = document.getElementById(id);
            if (el) observer.unobserve(el);
        });
    }, [validSections]);

    useEffect(() => {
        if (activeSection && topicsListRef.current) {
            const activeIndex = validSections.findIndex(s => s.title.toLowerCase().replace(/\s+/g, '-') === activeSection);
            const activeTopicRef = topicRefs.current[activeIndex];
            if (activeTopicRef) {
                setPillStyle({
                    top: activeTopicRef.offsetTop,
                    height: activeTopicRef.offsetHeight,
                    opacity: 1,
                });
            }
        }
    }, [activeSection, validSections]);

    const handleSectionClick = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element && headerRef.current) {
            const headerHeight = headerRef.current.offsetHeight;
            const extraPadding = 20;
            const offset = headerHeight + extraPadding;

            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
    
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };
    
    const timeToRead = useMemo(() => {
        if (!validSections) return 1;
        const extractText = (blocks) => blocks.map(b => b.children?.map(c => c.text).join('')).join(' ');
        const text = validSections.map(s => extractText(s.description || [])).join(' ');
        const wordCount = text.split(/\s+/).length;
        return Math.ceil(wordCount / 200);
    }, [validSections]);

    const renderContent = (sections) => {
        if (!sections) return null;
        return sections.map((section) => {
            const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
            return (
                <div key={sectionId} id={sectionId} className="mb-12 scroll-mt-32">
                    <h2 className="text-3xl font-bold text-teal-700 mb-4 border-b border-slate-200 pb-2">{section.title}</h2>
                    {section.description && (
                        <div className="prose prose-xl max-w-none">
                            <PortableText value={section.description} components={ptComponents} />
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="bg-slate-100 text-slate-800 font-sans">
            <div className="sticky top-0 z-40" ref={headerRef}>
                <Header />
            </div>

            <main className="flex flex-row items-start">
                <aside className="w-80 flex-shrink-0 bg-slate-50 border-r border-slate-200 h-[calc(100vh-116px)] lg:sticky top-[116px] hidden lg:flex flex-col">
                    <div className="px-6 pt-6 pb-4 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-1">{contentItem.title}</h2>
                        <p className="text-xl text-slate-500">Summary Box</p>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto">

                        {documents.length > 0 && (
                            <div className="mb-4">
                               <button onClick={() => toggleSection("documents")} className="w-full text-left font-semibold text-slate-700 mb-2 flex justify-between items-center text-lg p-2 rounded-md hover:bg-slate-200">
                                   <div className="flex items-center gap-3"><FiFileText />Documents Required</div>
                                   <span className={`transition-transform text-slate-500 ${openSections.documents ? "rotate-180" : ""}`}>▾</span>
                               </button>
                               {openSections.documents && (
                                   <ul className="flex flex-col gap-1 text-slate-600 pl-3 mt-2">
                                       {documents.map((docName, idx) => (
                                           <li key={idx} className="pl-4 text-base flex items-center gap-3 py-1.5 border-l border-slate-200"><span className="text-indigo-500">▪</span> {docName}</li>
                                       ))}
                                   </ul>
                               )}
                           </div>
                        )}
                        {validSections.length > 0 && (
                            <div>
                                <button onClick={() => toggleSection("topic")} className="w-full text-left font-semibold text-slate-700 mb-2 flex justify-between items-center text-lg p-2 rounded-md hover:bg-slate-200">
                                    <div className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                        Sub-Topics
                                    </div>
                                    <span className={`transition-transform text-slate-500 ${openSections.topic ? "rotate-180" : ""}`}>▾</span>
                                </button>
                                {openSections.topic && (
                                    <ul className="flex flex-col relative" ref={topicsListRef}>
                                        <div className="absolute left-0 w-full bg-indigo-600 rounded-md shadow-lg transition-all duration-300 ease-in-out" style={pillStyle}></div>
                                        {validSections.map((section, index) => {
                                            const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
                                            const isActive = activeSection === sectionId;
                                            return (
                                                <li key={sectionId} ref={el => topicRefs.current[index] = el}>
                                                    <button onClick={() => handleSectionClick(sectionId)} className={`relative w-full text-left p-3 rounded-md transition-colors duration-200 text-base flex items-center gap-3 ${isActive ? "text-white font-semibold" : "text-slate-600 hover:text-slate-900"}`}>
                                                        <FaChevronRight className={`transition-transform ${isActive ? 'scale-110' : 'scale-100'}`} />
                                                        {section.title}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        )}
                                                {contentItem.attachmentURL && (
                            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    Attachment
                                </h3>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm text-slate-600 truncate" title={contentItem.attachmentFileName}>{contentItem.attachmentFileName || 'Download file'}</span>
                                    <a href={contentItem.attachmentURL} download target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-indigo-600 text-white font-semibold text-sm rounded-md hover:bg-indigo-700 transition-colors shadow-sm flex-shrink-0">Download</a>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
                
                <section className="flex-1 min-w-0 py-8 pr-4 pl-8 bg-white shadow-inner-left">
                    <div>
                        {contentItem ? (
                            <>
                                <div className="mb-10">
                                    <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4">{contentItem.title}</h1>
                                    {contentItem.subtitle && <p className="text-xl text-slate-600 italic">{contentItem.subtitle}</p>}
                                </div>
                                {renderContent(validSections)}
                            </>
                        ) : (<p className="p-8">Loading Content...</p>)}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}