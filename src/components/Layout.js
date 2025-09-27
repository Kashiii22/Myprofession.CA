// components/Layout.js
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div>
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <Link href="/"><span className="font-bold text-xl cursor-pointer">MyProfession.CA</span></Link>
          <nav>
            <Link href="/" className="mr-4">Home</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
