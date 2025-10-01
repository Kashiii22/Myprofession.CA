"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { sanityClient } from "../../../lib/sanityClient"; 

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
    sections[]{..., documentsRequired[]->},
    documentsRequired[]{..., asset->{_id, originalFilename, url}}
  }`;

  const contentItem = await sanityClient.fetch(query, { slug: contentSlug, categorySlug });

  console.log("Fetched contentItem:", contentItem);

  if (!contentItem) {
    return { notFound: true };
  }

  return {
    props: { contentItem, categorySlug, contentSlug },
    revalidate: 60,
  };
}

export default function CategoryPage({ contentItem }) {
  const articles = contentItem ? [contentItem] : [];
  const documents = contentItem?.attachments?.length > 0 ? [contentItem] : [];

  const buildSelected = (item) => {
    if (!item) return null;
    if (item.attachments?.length > 0) {
      return {
        type: "document",
        data: item,
        id: item.attachments[0].asset.url,
        attachment: item.attachments[0],
      };
    }
    return { type: "article", data: item, id: item.slug };
  };

  const [selectedItem, setSelectedItem] = useState(buildSelected(contentItem));
  const [openSections, setOpenSections] = useState({ articles: true, documents: true });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedItem(buildSelected(contentItem));
  }, [contentItem]);

  const filteredArticles = useMemo(
    () => articles.filter((a) => a.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [articles, searchTerm]
  );

  const filteredDocuments = useMemo(
    () => documents.filter((d) => d.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [documents, searchTerm]
  );

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Corrected renderContent function
  const renderContent = (sections) => {
  if (!sections) return null;

  return sections.map((section, idx) => (
    <div key={idx} className="mb-8">
      <h2 className="text-3xl font-bold text-blue-400 mb-4">{section.title}</h2>

      {section.description && section.description.length > 0 && (
        <div className="text-gray-300 text-lg md:text-xl leading-relaxed font-sans">
          {section.description.map((block, bidx) => {
            // Build text with hyperlinks
            const blockText = block.children.map((child) => {
              if (child.marks && child.marks.length > 0) {
                // Check for link marks
                return child.marks.map((mark) => {
                  const markDef = block.markDefs?.find((m) => m._key === mark);
                  if (markDef?.href) {
                    return (
                      <a
                        key={child._key}
                        href={markDef.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-blue-300"
                      >
                        {child.text}
                      </a>
                    );
                  }
                  return child.text;
                });
              }
              return child.text;
            });

            // Split lines for headings, lists, and paragraphs
            const lines = Array.isArray(blockText)
              ? blockText.flat()
              : blockText;

            return lines.map((line, i) => {
              if (typeof line === "string") {
                if (line.startsWith("### ")) {
                  return <h3 key={i} className="text-blue-300 font-semibold text-2xl my-2">{line.replace("### ", "")}</h3>;
                } else if (line.startsWith("## ")) {
                  return <h2 key={i} className="text-blue-400 font-bold text-3xl my-3">{line.replace("## ", "")}</h2>;
                } else if (line.startsWith("# ")) {
                  return <h1 key={i} className="text-blue-500 font-extrabold text-4xl my-4">{line.replace("# ", "")}</h1>;
                } else if (line.startsWith("- ")) {
                  return <li key={i} className="ml-6 list-disc">{line.replace("- ", "")}</li>;
                } else if (line.match(/^\d+\./)) {
                  return <li key={i} className="ml-6 list-decimal">{line}</li>;
                } else {
                  return <p key={i} className="my-2">{line}</p>;
                }
              } else {
                // If it's already a React element (hyperlink)
                return <span key={i}>{line}</span>;
              }
            });
          })}
        </div>
      )}

      {/* Attachments */}
      {section.attachments?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-yellow-400 font-semibold mb-2">Attachments for {section.title}:</h4>
          {section.attachments.map((att, i) => (
            <a
              key={i}
              href={att.asset?.url}
              download
              className="block text-blue-300 hover:text-blue-400 font-semibold underline mb-1"
            >
              {att.asset?.originalFilename || "Attachment"}
            </a>
          ))}
        </div>
      )}

      {/* Video */}
      {section.video && (
        <div className="mt-6">
          <h4 className="text-green-400 font-semibold mb-2">Video:</h4>
          <video className="w-full rounded-md" controls>
            <source src={section.video.asset?.url} type={section.video.asset?.mimeType} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Video Link */}
      {section.videoLink && (
        <div className="mt-6">
          <h4 className="text-green-400 font-semibold mb-2">Video Link:</h4>
          <iframe
            className="w-full aspect-video rounded-md"
            src={section.videoLink.replace("watch?v=", "embed/")}
            title={section.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  ));
};


  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
      <Header />
      <main className="flex flex-1 container mx-auto px-4 py-8 gap-6">
        {/* Left Pane */}
        <aside className="w-80 bg-gray-900 rounded-2xl p-4 border border-gray-700 overflow-y-auto h-[80vh] shadow-lg">
          <h2 className="text-xl font-bold text-blue-400 mb-4">Contents</h2>

          <input
            type="text"
            placeholder="Search articles or documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 p-2 rounded-md bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div>
            <button
              onClick={() => toggleSection("documents")}
              className="w-full text-left font-semibold text-yellow-400 mb-2 flex justify-between items-center text-2xl"
            >
              Documents Required ({filteredDocuments.length}){" "}
              {openSections.documents ? "▾" : "▸"}
            </button>
            {openSections.documents && (
              <ul className="flex flex-col gap-2">
                {filteredDocuments.map((doc, idx) =>
                  doc.attachments.map((att, aidx) => (
                    <li
                      key={`${idx}-${aidx}`}
                      className={`p-2 rounded-md cursor-pointer hover:bg-gray-800 transition text-xl ${
                        selectedItem?.type === "document" && selectedItem?.id === att.asset.url
                          ? "bg-gray-800 border-l-4 border-blue-400"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedItem({
                          type: "document",
                          data: doc,
                          attachment: att,
                          id: att.asset.url,
                        })
                      }
                    >
                      {doc.title} - {att.asset.originalFilename}
                    </li>
                  ))
                )}
                {filteredDocuments.length === 0 && (
                  <li className="text-gray-400 p-2">No matching documents.</li>
                )}
              </ul>
            )}
          </div>

          {/* Articles Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection("articles")}
              className="w-full text-left font-semibold text-yellow-400 mb-2 flex justify-between items-center text-2xl"
            >
              Sub-Topic ({filteredArticles.length}){" "}
              {openSections.articles ? "▾" : "▸"}
            </button>
            {openSections.articles && (
              <ul className="flex flex-col gap-2">
                {filteredArticles.map((a) => (
                  <li
                    key={a.slug}
                    className={`p-2 rounded-md cursor-pointer hover:bg-gray-800 transition text-xl${
                      selectedItem?.type === "article" && selectedItem?.id === a.slug
                        ? "bg-gray-800 border-l-4 border-blue-400 text-xl"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedItem({
                        type: "article",
                        data: a,
                        id: a.slug,
                      })
                    }
                  >
                    {a.title}
                  </li>
                ))}
                {filteredArticles.length === 0 && (
                  <li className="text-gray-400 p-2">No matching articles.</li>
                )}
              </ul>
            )}
          </div>
        </aside>

        {/* Right Pane */}
        <section className="flex-1 bg-gray-900 rounded-3xl p-8 shadow-lg overflow-y-auto h-[80vh]">
          {selectedItem ? (
            selectedItem.type === "article" ? (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-6">
                  {selectedItem.data.title}
                </h1>

                <div>{renderContent(selectedItem.data.sections)}</div>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-4">
                  {selectedItem.data.title}
                </h1>
                <p className="text-gray-300 text-lg md:text-xl mb-4 leading-relaxed">
                  {selectedItem.data.description || "Download this document for practical use."}
                </p>
                <a
                  href={selectedItem.attachment.asset.url}
                  download
                  className="text-blue-300 hover:text-blue-400 font-semibold underline"
                >
                  {selectedItem.attachment.asset.originalFilename}
                </a>
              </>
            )
          ) : (
            <p className="text-gray-400 text-lg md:text-xl">
              Select an article or document from the left to view its content.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
