"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { contents, categories } from "../../../../data/dummyData";

export async function getStaticPaths() {
  const paths = [];

  // Build all category/content combinations
  Object.keys(contents).forEach((categorySlug) => {
    contents[categorySlug].forEach((item) => {
      paths.push({
        params: {
          categorySlug,           // first segment
          contentSlug: item.slug, // second segment
        },
      });
    });
  });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { categorySlug, contentSlug } = params;

  const categoryContents = contents[categorySlug] || [];
  const contentItem =
    categoryContents.find((c) => c.slug === contentSlug) || null;

  return {
    props: {
      categorySlug,
      contentSlug,
      categoryContents,
      contentItem,
    },
  };
}

export default function CategoryPage({
  categorySlug,
  contentSlug,
  categoryContents,
  contentItem,
}) {
  const articles = categoryContents.filter((c) => c.contentType === "text");
  const documents = categoryContents.filter((c) => c.attachments.length > 0);

  // Preselect item based on the URL slug
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

  // If contentItem changes because of navigation, update selectedItem
  useEffect(() => {
    setSelectedItem(buildSelected(contentItem));
  }, [contentItem]);

  const [openSections, setOpenSections] = useState({
    articles: true,
    documents: true,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = useMemo(
    () =>
      articles.filter((a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [articles, searchTerm]
  );

  const filteredDocuments = useMemo(
    () =>
      documents.filter((d) =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [documents, searchTerm]
  );

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Render Markdown-like text manually
  const renderContent = (body) => {
    return body.map((block, idx) => (
      <div
        key={idx}
        className="mb-4 text-gray-300 text-lg md:text-xl leading-relaxed font-sans"
      >
        {block.children[0].text.split("\n").map((line, i) => {
          if (line.startsWith("### ")) {
            return (
              <h3
                key={i}
                className="text-blue-300 font-semibold text-2xl my-2"
              >
                {line.replace("### ", "")}
              </h3>
            );
          } else if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="text-blue-400 font-bold text-3xl my-3">
                {line.replace("## ", "")}
              </h2>
            );
          } else if (line.startsWith("# ")) {
            return (
              <h1
                key={i}
                className="text-blue-500 font-extrabold text-4xl my-4"
              >
                {line.replace("# ", "")}
              </h1>
            );
          } else if (line.startsWith("- ")) {
            return (
              <li key={i} className="ml-6 list-disc">
                {line.replace("- ", "")}
              </li>
            );
          } else if (line.match(/^\d+\./)) {
            return (
              <li key={i} className="ml-6 list-decimal">
                {line}
              </li>
            );
          } else {
            return <p key={i} className="my-2">{line}</p>;
          }
        })}
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

          {/* Articles Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection("articles")}
              className="w-full text-left font-semibold text-blue-400 mb-2 flex justify-between items-center"
            >
              Articles ({filteredArticles.length}){" "}
              {openSections.articles ? "▾" : "▸"}
            </button>
            {openSections.articles && (
              <ul className="flex flex-col gap-2">
                {filteredArticles.map((a) => (
                  <li
                    key={a.slug}
                    className={`p-2 rounded-md cursor-pointer hover:bg-gray-800 transition ${
                      selectedItem?.type === "article" &&
                      selectedItem?.id === a.slug
                        ? "bg-gray-800 border-l-4 border-blue-400"
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

          {/* Documents Section */}
          <div>
            <button
              onClick={() => toggleSection("documents")}
              className="w-full text-left font-semibold text-yellow-400 mb-2 flex justify-between items-center"
            >
              Documents ({filteredDocuments.length}){" "}
              {openSections.documents ? "▾" : "▸"}
            </button>
            {openSections.documents && (
              <ul className="flex flex-col gap-2">
                {filteredDocuments.map((doc, idx) =>
                  doc.attachments.map((att, aidx) => (
                    <li
                      key={`${idx}-${aidx}`}
                      className={`p-2 rounded-md cursor-pointer hover:bg-gray-800 transition ${
                        selectedItem?.type === "document" &&
                        selectedItem?.id === att.asset.url
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
        </aside>

        {/* Right Pane */}
        <section className="flex-1 bg-gray-900 rounded-3xl p-8 shadow-lg overflow-y-auto h-[80vh]">
          {selectedItem ? (
            selectedItem.type === "article" ? (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-6">
                  {selectedItem.data.title}
                </h1>

                <div>{renderContent(selectedItem.data.body)}</div>

                {selectedItem.data.attachments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-yellow-400 font-semibold mb-2">
                      Attachments:
                    </h4>
                    {selectedItem.data.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.asset.url}
                        download
                        className="block text-blue-300 hover:text-blue-400 font-semibold underline mb-1"
                      >
                        {att.asset.originalFilename}
                      </a>
                    ))}
                  </div>
                )}

                {selectedItem.data.youtubeUrl && (
                  <div className="mt-6">
                    <h4 className="text-green-400 font-semibold mb-2">
                      Video Tutorial:
                    </h4>
                    <iframe
                      className="w-full aspect-video rounded-md"
                      src={selectedItem.data.youtubeUrl.replace(
                        "watch?v=",
                        "embed/"
                      )}
                      title={selectedItem.data.title}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-4">
                  {selectedItem.data.title}
                </h1>
                <p className="text-gray-300 text-lg md:text-xl mb-4 leading-relaxed">
                  {selectedItem.data.description ||
                    "Download this document for practical use."}
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
