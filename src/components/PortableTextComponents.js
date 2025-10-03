import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../lib/sanityClient';

// --- Reusable Image Component ---
const SanityImage = ({ value }) => {
  if (!value?.asset) {
    return null;
  }
  return (
    <div className="relative my-6 shadow-lg rounded-md overflow-hidden">
      <Image
        src={urlFor(value).width(800).fit('max').auto('format').url()}
        alt={value.alt || ' '}
        loading="lazy"
        width={800}
        height={600}
        className="w-full h-auto object-contain bg-gray-800"
      />
      {value.caption && (
        <figcaption className="text-center text-sm text-gray-400 p-2 bg-gray-900">
          {value.caption}
        </figcaption>
      )}
    </div>
  );
};

// --- Reusable Table Component ---
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
                <td key={cell._key} className="py-4 px-4 text-lg text-gray-300">
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

// --- Reusable Nested List Component ---
const NestedOrderedList = ({ children, level }) => {
  const getListStyle = (lvl) => {
    switch (lvl) {
      case 1: return 'list-decimal';
      case 2: return 'list-[lower-alpha]';
      case 3: return 'list-[lower-roman]';
      case 4: return 'list-[upper-roman]';
      default: return 'list-decimal';
    }
  };

  return (
    <ol className={`${getListStyle(level)} pl-8 my-4 space-y-3 text-lg`}>
      {children}
    </ol>
  );
};


// --- Main Export: All Components ---
export const ptComponents = {
  types: {
    image: SanityImage,
    imageBlock: SanityImage,
    table: TableComponent,
  },

  list: {
    bullet: ({ children }) => <ul className="list-disc pl-8 my-4 space-y-3 text-lg">{children}</ul>,
    number: NestedOrderedList,
  },

  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },

  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    
    link: ({ value, children }) => {
      const { href } = value;
      return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{children}</a>;
    },
    
    // ✨ CORRECTED INTERNAL LINK COMPONENT ✨
    internalLink: ({ value, children }) => {
      const href = `/category/${value.categorySlug}/${value.slug}`;
      return (
        // The <a> tag is removed, and its className is moved to the <Link> component
        <Link href={href} className="text-blue-400 hover:underline font-semibold">
          {children}
        </Link>
      );
    },
  },

  block: {
    normal: ({ children }) => <p className="my-4 text-xl text-white font-sans">{children}</p>,
    h1: ({ children }) => <h1 className="text-white font-extrabold text-4xl my-6 font-sans">{children}</h1>,
    h2: ({ children }) => <h2 className="text-blue-400 font-bold text-3xl my-5 font-sans border-b-2 border-gray-800 pb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-blue-300 font-semibold text-2xl my-4 font-sans">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4 font-sans text-white">{children}</blockquote>,
  },
};