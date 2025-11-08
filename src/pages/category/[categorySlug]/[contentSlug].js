"use client";

// 1. Import new hooks and components
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { sanityClient } from "../../../lib/sanityClient";
import { PortableText } from '@portabletext/react';
import { ptComponents } from "../../../components/PortableTextComponents";
import { FiFileText, FiLock } from "react-icons/fi"; // Added FiLock
import { FaChevronRight } from "react-icons/fa";
import AuthModal from "../../../components/AuthModal"; // Added AuthModal

// ✅ 1. Import Redux hooks and actions
import { useSelector, useDispatch } from "react-redux";
// Make sure this path is correct for your project
import { setLoginSuccess } from "../../../redux/authSlice"; 

// --- DATA FETCHING (No Changes) ---
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
                        cells
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
    
    if (!contentItem) {
        return { notFound: true };
    }
    
    return {
        props: { contentItem },
        revalidate: 60,
    };
}
// --- END OF DATA FETCHING ---

// 2. Add Cookie helper functions
const AUTH_COOKIE_NAME = "token";
const getCookie = (name) => {
  if (typeof window === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

// 3. Helper function to count words in Portable Text
const getWordCount = (blocks) => {
    if (!blocks) return 0;
    return blocks
        .filter(b => b._type === 'block' && b.children)
        .flatMap(b => b.children.map(c => c.text || ''))
        .join(' ')
        .split(/\s+/)
        .filter(Boolean).length;
};
// --- End of Cookie/WordCount helpers ---


export default function CategoryPage({ contentItem }) {
    const router = useRouter(); 
    const [openSections, setOpenSections] = useState({ documents: false, topic: true }); // Default topic to open
    const [activeSection, setActiveSection] = useState('');
    
    const headerRef = useRef(null);
    
    const documents = useMemo(() => contentItem?.documentsRequired?.flatMap(docList => docList.documents) || [], [contentItem]);
    const validSections = useMemo(() => contentItem?.sections?.filter(section => section && section.title) || [], [contentItem]);

    const [pillStyle, setPillStyle] = useState({ top: 0, height: 0, opacity: 0 });
    const topicRefs = useRef([]);
    const topicsListRef = useRef(null);
    
    // ✅ 4. Use Redux state instead of local state
    const dispatch = useDispatch();
    const { isLoggedIn, authLoading } = useSelector((state) => state.auth);
    
    // This local state is still fine
    const [showLoginModal, setShowLoginModal] = useState(false);

    // ✅ 5. REMOVED the local useEffect that checked the cookie.
    // Your Header.jsx now handles this globally.

    // ✅ 6. This memo now reads from the global Redux state
    const isTruncated = useMemo(() => {
        if (isLoggedIn || authLoading) return false; // Never truncate if logged in

        const totalWords = validSections.reduce((acc, section) => acc + getWordCount(section.description), 0);
        return totalWords > 150; // Set to true if content is long
    }, [isLoggedIn, authLoading, validSections]); // Depends on global state


    const toggleSection = (section) => setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

    // Intersection Observer (No Change)
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

    // Active Pill Effect (No Change)
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

    // Section Click Handler (No Change)
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
    
    // Time to Read (No Change)
    const timeToRead = useMemo(() => {
        if (!validSections) return 1;
        const extractText = (blocks) => blocks.map(b => b.children?.map(c => c.text).join('')).join(' ');
        const text = validSections.map(s => extractText(s.description || [])).join(' ');
        const wordCount = text.split(/\s+/).length;
        return Math.ceil(wordCount / 200);
    }, [validSections]);

    // ✅ 7. This memo now reads from the global Redux state
    const customPtComponents = useMemo(() => ({
        ...ptComponents, // Import all your default components
        types: {
            ...ptComponents.types, // Import default types (image, table, etc.)
            
            // Override the 'attachment' type
            attachment: ({ value }) => {
                if (isLoggedIn) { // ✅ Reads from global state
                    // Logged-in: Show download link
                    return (
                        <a 
                            href={value.fileURL} 
                            download 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-4 my-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-semibold hover:bg-blue-100 transition"
                        >
                            <FiFileText className="text-xl" />
                            Download: {value.fileName || 'Attached File'}
                        </a>
                    );
                }
                
                // Logged-out: Show blocker
                return (
                    <div className="p-4 my-4 bg-slate-200 border border-slate-300 rounded-lg text-center">
                        <FiLock className="mx-auto text-3xl text-slate-500 mb-2" />
                        <p className="font-semibold text-lg text-slate-700">Attachment Locked</p>
                        <button 
                            onClick={() => setShowLoginModal(true)} 
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Login to download this file
                        </button>
                    </div>
                );
            }
        }
    }), [isLoggedIn]); // ✅ Depends on global state

    
    // renderContent function (now uses customPtComponents)
    const renderContent = (sections) => {
        if (!sections) return null;
        return sections.map((section) => {
            const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
            return (
                <div key={sectionId} id={sectionId} className="mb-12 scroll-mt-32">
                    <h2 className="text-2xl font-bold text-black mb-4 bg-gray-200 border-b border-slate-200 pb-2">{section.title}</h2>
                    {section.description && (
                        <div className="prose prose-xl ">
                            <PortableText value={section.description} components={customPtComponents} />
                        </div>
                    )}
                </div>
            );
        });
    };

    // ✅ 8. This handler now reads from the global Redux state
    const handleAttachmentClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // Stop the link from working
            setShowLoginModal(true); // Open login modal
        }
        // If logged in, do nothing, and the default link behavior (download) will proceed
    };

    // 9. Component for the loading state (No Change)
    const LoadingSpinner = () => (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg">Loading content...</p>
        </div>
    );

    return (
        <div className="bg-slate-100 text-slate-800 font-sans">
            <div className="sticky top-0 z-40" ref={headerRef}>
                <Header />
            </div>

            <main className="flex flex-row items-start">
                {/* --- SIDEBAR --- */}
                <aside className="w-69 flex-shrink-0  bg-slate-200 border-r border-slate-200 h-[calc(100vh-116px)] lg:sticky top-[116px] hidden lg:flex flex-col">
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
                                        {/* Topics are shown regardless of login */}
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

                        {/* ✅ 10. UPDATED ATTACHMENT SECTION (Handler now reads global state) */}
                        {contentItem.attachmentURL && (
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                                    <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                        Attachment
                                    </h3>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm text-slate-600 truncate" title={contentItem.attachmentFileName}>{contentItem.attachmentFileName || 'Download file'}</span>
                                        <a 
                                            href={contentItem.attachmentURL} 
                                            download 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            onClick={handleAttachmentClick} // <-- This blocks the download
                                            className="px-3 py-1 bg-indigo-600 text-white font-semibold text-sm rounded-md hover:bg-indigo-700 transition-colors shadow-sm flex-shrink-0"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
                
                {/* --- MAIN CONTENT --- */}
                <section className="flex-1 min-w-0 py-8 pr-20 g-white shadow-inner-left relative">
                    <div className="max-w-5xl mx-auto">
                        {contentItem ? (
                            <>
                                <div className="mb-10">
                                    <h1 className="md:text-4xl font-extrabold text-black-700 mb-4">{contentItem.title}</h1>
                                    {contentItem.subtitle && <p className="text-xl text-slate-600 italic">{contentItem.subtitle}</p>}
                                </div>
                                
                                {/* ✅ 11. Auth checking now uses global Redux state */}
                                {authLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <div className="relative">
                                    
                                        {/* This div reads from global state */}
                                        <div className={!isLoggedIn && isTruncated ? "max-h-[500px] overflow-hidden" : ""}>
                                            {renderContent(validSections)}
                                        </div>

                                        {/* This div reads from global state */}
                                        {!isLoggedIn && isTruncated && (
                                            <div className="absolute bottom-0 left-0 w-full h-80 flex flex-col justify-end" style={{ background: 'linear-gradient(to top, rgba(255,255,255,1) 30%, rgba(255,255,255,0.7) 70%, transparent)' }}>
                                                <div className="flex flex-col items-center justify-center p-10 text-center">
                                                    <FiLock className="text-4xl text-slate-500 mb-4" />
                                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Continue Reading</h3>
                                                    <p className="text-lg text-slate-600 mb-6">Log in or sign up to unlock the full article.</p>
                                                    <button
                                                        onClick={() => setShowLoginModal(true)}
                                                        className="text-md font-medium px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md hover:shadow-lg"
                                                    >
                                                        Login to Continue
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (<p className="p-8">Loading Content...</p>)}
                    </div>
                </section>
            </main>

            <Footer />

            {/* ✅ 12. AuthModal now dispatches the global action on success */}
            {showLoginModal && (
                <AuthModal
                    onClose={() => {
                        setShowLoginModal(false);
                    }}
                    onLoginSuccess={() => {
                        setShowLoginModal(false);
                        dispatch(setLoginSuccess()); // Set global state to true
                    }}
                />
            )}
        </div>
    );
}