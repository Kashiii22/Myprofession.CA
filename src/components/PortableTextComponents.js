import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../lib/sanityClient';

// --- Reusable Image Component ---
const SanityImage = ({ value }) => {
  if (!value?.asset) return null;
  return (
    <figure className="relative my-6 shadow-md rounded-lg overflow-hidden border border-slate-200">
      <Image
        src={urlFor(value).width(800).fit('max').auto('format').url()}
        alt={value.alt || ' '}
        loading="lazy"
        width={800}
        height={600}
        className="w-full h-auto object-contain bg-slate-50"
      />
      {value.caption && (
        <figcaption className="text-center text-sm text-slate-500 p-2 bg-slate-100">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
};

// --- Reusable Table Component ---
const TableComponent = ({ value }) => {
  const { rows } = value;
  if (!rows) return null;
  return (
    <div className="overflow-x-auto my-6 border border-slate-300 rounded-lg">
      <table className="min-w-full">
        <tbody className="divide-y divide-slate-200">
          {rows.map((row) => (
            <tr key={row._key} className="bg-white">
              {row.cells.map((cell) => (
                // ✅ CHANGED: text-base is now text-lg for better table readability
                <td key={cell._key} className="py-3 px-4 text-lg text-slate-700">
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

// --- Reusable Attachment Component ---
const AttachmentComponent = ({ value }) => {
  if (!value?.fileURL) return null;
  return (
    <div className="my-6 p-4 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
      <div className="flex-grow">
        <p className="font-semibold text-slate-800">{value.description || 'Download File'}</p>
        <p className="text-sm text-slate-500">{value.fileName}</p>
      </div>
      <a 
        href={value.fileURL} 
        download 
        target="_blank" 
        rel="noopener noreferrer"
        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
      >
        Download
      </a>
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
      default: return 'list-decimal';
    }
  };
  return (
    <ol className={`${getListStyle(level)} pl-6 my-4 space-y-2`}>
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
    attachment: AttachmentComponent,
  },

  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>,
    number: NestedOrderedList,
  },

  listItem: ({ children }) => <li>{children}</li>,

  marks: {
    strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    
    link: ({ value, children }) => {
      const { href } = value;
      return <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{children}</a>;
    },
    
    internalLink: ({ value, children }) => {
      const href = `/category/${value.categorySlug}/${value.slug}`;
      return (
        <Link href={href} className="text-indigo-600 hover:underline font-semibold">
          {children}
        </Link>
      );
    },
  },

  // ✅ CLEANED UP: Removed redundant text-size classes (e.g., text-4xl).
  // The 'prose-xl' class now handles this automatically for better consistency.
  block: {
    normal: ({ children }) => <p className="my-4 leading-relaxed text-slate-700">{children}</p>,
    h1: ({ children }) => <h1 className="text-slate-900 font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-teal-700 font-semibold mt-8 mb-4 border-b border-slate-200 pb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-slate-800 font-semibold mt-6 mb-3">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-300 pl-4 italic my-4 text-slate-600 bg-slate-100 py-2">{children}</blockquote>,
    
    // Alignment styles
    center: ({ children }) => <p className="my-4 leading-relaxed text-slate-700 text-center">{children}</p>,
    right: ({ children }) => <p className="my-4 leading-relaxed text-slate-700 text-right">{children}</p>,
  },
};