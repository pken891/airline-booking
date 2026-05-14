'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Confirmation() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(function () {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');

    if (!ref) {
      setError('No booking reference found.');
      setLoading(false);
      return;
    }

    async function loadBooking() {
      try {
        const response = await fetch('/api/bookings/' + ref);
        const data = await response.json();
        if (!response.ok) {
          setError('Booking not found.');
          setLoading(false);
          return;
        }
        setBooking(data);
        setLoading(false);
      } catch (e) {
        setError('Failed to load booking.');
        setLoading(false);
      }
    }

    loadBooking();
  }, []);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  }

  function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('en-NZ', {
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false
    });
  }

  function formatBookedAt(dateString) {
    return new Date(dateString).toLocaleString('en-NZ', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false
    });
  }

  if (loading) return <p className="text-gray-500">Loading booking details...</p>;

  if (error) return (
    <div>
      <p className="text-red-500">{error}</p>
      <Link href="/flights" className="text-[#6fc3df] underline">Back to Flights</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">

      {/* Success banner */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-8 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-2">✅ Booking Confirmed!</h1>
        <p className="text-3xl font-bold text-green-800 mb-1">{booking.bookingReference}</p>
        <p className="text-sm text-green-600">Please save this reference for your records.</p>
      </div>

      {/* Flight details */}
      <div className="border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#6fc3df] mb-4">Flight Details</h2>
        <table className="w-full text-sm">
          <tbody>
            {[
              ['Flight Number', booking.flightNumber],
              ['From', booking.origin],
              ['To', booking.destination],
              ['Date', formatDate(booking.departureDateTime)],
              ['Departs', formatTime(booking.departureDateTime)],
              ['Arrives', formatTime(booking.arrivalDateTime)],
              ['Aircraft', booking.aircraft],
              ['Price', `$${booking.price}`],
            ].map(([label, value]) => (
              <tr key={label} className="border-b border-gray-100 last:border-0">
                <td className="py-2 pr-4 font-medium w-40 text-gray-600">{label}</td>
                <td className="py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Passenger details */}
      <div className="border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold text-[#6fc3df] mb-4">Passenger Details</h2>
        <table className="w-full text-sm">
          <tbody>
            {[
              ['Name', booking.passengerName],
              ['Email', booking.passengerEmail],
              ['Booked At', formatBookedAt(booking.bookedAt)],
            ].map(([label, value]) => (
              <tr key={label} className="border-b border-gray-100 last:border-0">
                <td className="py-2 pr-4 font-medium w-40 text-gray-600">{label}</td>
                <td className="py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button onClick={() => window.print()} className="bg-[#6fc3df] text-white px-6 py-2 rounded-lg hover:bg-[#0f7bbf] transition-colors"> Print / Save as PDF
        </button>
        <Link href="/flights" className="border border-[#6fc3df] text-[#6fc3df] px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"> Book Another Flight
        </Link>
        <Link href="/" className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"> Back to Home </Link>
      </div>
    </div>
  );
}