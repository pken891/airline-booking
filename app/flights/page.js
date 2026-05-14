'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');

  useEffect(function () {
    fetchFlights();
  }, []);

  async function fetchFlights() {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (origin) {
        params.append('origin', origin);
      }
      if (destination) {
        params.append('destination', destination);
      }
      if (date1) {
        params.append('date1', date1);
      }
      if (date2) {
        params.append('date2', date2);
      }

      const response = await fetch('/api/flights?' + params.toString());
      const data = await response.json();

      if (!response.ok) {
        setError('Failed to load flights');
        setLoading(false);
        return;
      }

      setFlights(data);
      setLoading(false);
    } catch (e) {
      setError('Failed to load flights');
      setLoading(false);
    }
  }

  function clearSearch() {
    setOrigin('');
    setDestination('');
    setDate1('');
    setDate2('');
    setFlights([]);
    setLoading(false);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('en-NZ', {
      hour: '2-digit', minute: '2-digit', hour12: false
    });
  }

  const airports = [
    { label: 'All', value: '' },
    { label: 'Dairy Flat (NZNE)', value: 'Dairy Flat' },
    { label: 'Sydney (YSSY)', value: 'Sydney' },
    { label: 'Rotorua (NZRO)', value: 'Rotorua' },
    { label: 'Great Barrier Island (NZGB)', value: 'Great Barrier Island' },
    { label: 'Chatham Islands (NZCI)', value: 'Chatham Islands' },
    { label: 'Lake Tekapo (NZTL)', value: 'Lake Tekapo' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#6fc3df] mb-6">Available Flights</h1>

      {/* Search Panel */}
      <div className="border border-gray-200 rounded-lg p-6 mb-8 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#6fc3df] mb-4">Search Flights</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
            <select value={origin} onChange={e => setOrigin(e.target.value)}>
              {airports.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <select value={destination} onChange={e => setDestination(e.target.value)}>
              {airports.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input type="date" value={date1} onChange={e => setDate1(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input type="date" value={date2} onChange={e => setDate2(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={fetchFlights}
            className="bg-[#6fc3df] text-white px-6 py-2 rounded-lg hover:bg-[#0f7bbf] transition-colors"
          >
            Search
          </button>
          <button
            onClick={clearSearch}
            className="border border-[#cc1c2f] text-[#cc1c2f] px-6 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading flights...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && flights.length === 0 && (
        <p className="text-gray-500">No flights found. Try adjusting your search.</p>
      )}

      {!loading && !error && flights.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="w-full">
            <thead>
              <tr>
                {['Flight', 'From', 'To', 'Date', 'Departs', 'Arrives', 'Aircraft', 'Price', 'Seats', 'Book'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flights.map(flight => (
                <tr key={flight._id}>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.origin}</td>
                  <td>{flight.destination}</td>
                  <td>{formatDate(flight.departureDateTime)}</td>
                  <td>{formatTime(flight.departureDateTime)}</td>
                  <td>{formatTime(flight.arrivalDateTime)}</td>
                  <td>{flight.aircraft}</td>
                  <td>${flight.price}</td>
                  <td>{flight.seatsAvailable}</td>
                  <td>
                    {flight.seatsAvailable > 0
                      ? <Link href={'/booking?flightId=' + flight._id}
                        className="text-[#6fc3df] font-medium hover:underline">Book</Link>
                      : <span className="text-[#cc1c2f] font-medium">Full</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}