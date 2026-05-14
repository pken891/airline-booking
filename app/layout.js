import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Dairy Flat Airyways',
  description: 'Book flights with Dairy Flat Airways Today!'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <nav className="bg-[#6fc3df] text-white shadow-md">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-wide hover:text-blue-200 transition-colors">
              ✈ Dairy Flat Airways
            </Link>
            <div className="flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-blue-200 transition-colors">Home</Link>
              <Link href="/flights" className="hover:text-blue-200 transition-colors">Flights</Link>
              <Link href="/my-bookings" className="hover:text-blue-200 transition-colors">My Bookings</Link>
            </div>
          </div>
        </nav>
        <div className="h-1 bg-[#cc1c2f]" />
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
          {children}
        </main>
        <div className="h-1 bg-[#cc1c2f]" />
        <footer className="bg-[#6fc3df] text-blue-200 text-center text-sm py-4">
          © 2026 Dairy Flat Airways. All rights reserved.
        </footer>

      </body>
    </html>
  );
}