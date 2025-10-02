import { sanityClient } from "../lib/sanityClient";
import Link from 'next/link';
import Header from "../components/Header";
import Footer from "../components/Footer";

// This runs on the server for every search request
export async function getServerSideProps(context) {
  const { q = "" } = context.query; // Get search term from URL, e.g., /search?q=login

  if (!q) {
    return { props: { results: [], query: "" } }; // Return empty if no query
  }
  
  // Query to find content where the title matches the search term (case-insensitive)
  const query = `*[_type == "content" && title match $q + "*"]{
    title,
    "slug": slug.current,
    "categorySlug": category->slug.current
  }`;
  
  const results = await sanityClient.fetch(query, { q });

  return {
    props: {
      results,
      query: q,
    },
  };
}

export default function SearchPage({ results, query }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-400 mb-6">
          Search Results for: <span className="text-yellow-400">{query}</span>
        </h1>
        
        {results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((item) => (
              <li key={item.slug} className="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition">
                <Link href={`/category/${item.categorySlug}/${item.slug}`}>
                  <a className="text-xl text-gray-200 hover:text-blue-400">{item.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-400">No results found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}