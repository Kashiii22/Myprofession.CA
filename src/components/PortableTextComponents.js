import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../lib/sanityClient';

const TableComponent = ({ value }) => {
  const { rows } = value;
  if (!rows) return null;
  return (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-gray-700 border border-gray-700">
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {rows.map((row) => (
            <tr key={row._key}>
              {row.cells.map((cell) => (
                <td key={cell._key} className="py-4 px-4 text-sm text-gray-300">
                  <PortableText value={cell.content} components={ptComponents} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ptComponents = {
  types: {
    imageBlock: ({ value }) => {
      if (!value?.asset?.url) {
        return null;
      }
      return (
        <div className="relative my-6 shadow-lg rounded-md overflow-hidden">
          <Image
            src={value.asset.url}
            alt={value.alt || 'Image'}
            loading="lazy"
            width={800}
            height={600}
            className="w-full h-auto object-contain"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-400 mt-2">{value.caption}</figcaption>
          )}
        </div>
      );
    },
    table: TableComponent,
  },

  list: {
    bullet: ({ children }) => <ul className="list-disc pl-8 my-4 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-8 my-4 space-y-2">{children}</ol>,
  },

  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },

  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    link: ({ value, children }) => {
      // Your link component
    },
    internalLink: ({ value, children }) => {
      // Your internalLink component
    },
  },

  block: {
    // ✅ Added 'text-white' to make the paragraph text pure white
    normal: ({ children }) => <p className="my-4 text-lg text-white font-sans">{children}</p>,
    h1: ({ children }) => <h1 className="text-blue-500 font-extrabold text-4xl my-4 font-sans">{children}</h1>,
    h2: ({ children }) => <h2 className="text-blue-400 font-bold text-3xl my-3 font-sans">{children}</h2>,
    h3: ({ children }) => <h3 className="text-blue-300 font-semibold text-2xl my-2 font-sans">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4 font-sans">{children}</blockquote>,
  },
};