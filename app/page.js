import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Dairy Flat Airways</h1>
      <p>Welcome to Dairy Flat Airways booking system</p>
      <nav>
        <Link href="/flights">Browse & Book Flights</Link>
        <br />
        <Link href='/my-bookings'>My Bookings</Link>
      </nav>
    </div>
  );
}