import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-[#6fc3df] mb-4">Welcome to Dairy Flat Airways</h1>
      <p className="text-gray-600 text-lg mb-10">
        Premium flights from Dairy Flat Airport.
      </p>
      <div className="flex justify-center gap-6 flex-wrap">
        <Link href="/flights" className="bg-[#6fc3df] text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-[#0a6aa8] transition-colors">
          Browse & Book Flights
        </Link>
        <Link href="/my-bookings" className="border border-[#cc1c2f] text-[#cc1c2f] px-8 py-3 rounded-lg text-base font-medium hover:bg-red-50 transition-colors">
          My Bookings
        </Link>
      </div>
    </div>
  );
}