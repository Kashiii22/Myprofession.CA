// components/Card.jsx
import Link from "next/link";

export default function Card({ title, slug, image, type }) {
  return (
    <Link href={`/${type}/${slug}`} className="block border border-gray-200 rounded-lg shadow hover:shadow-md transition p-4 bg-white">
      {image && <img src={image} alt={title} className="w-full h-32 object-cover rounded-md mb-3" />}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </Link>
  );
}
