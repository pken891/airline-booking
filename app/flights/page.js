'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //filter state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

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
      if (date) {
        params.append('date', date);
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
      setError('failed to load flights');
      setLoading(false);
    }    
}

function clearSearch() {
  setOrigin('');
  setDestination('');
  setDate('');
}
function handleOriginChange(event) {
  setOrigin(event.target.value);
}
function handleDestinationChange(event) {
  setDestination(event.target.value);
}
function handleDateChange(event) {
  setDate(event.target.value);
}

function formatDate(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleDateString('en-NZ', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleTimeString('en-NZ', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

const flightRows = [];
for (let index=0; index<flights.length; index++) {
  const flight = flights[index];

  flightRows.push(
    <tr key={flight._id}>
      <td style={tdStyle}>{flight.flightNumber}</td>
      <td style={tdStyle}>{flight.origin}</td>
      <td style={tdStyle}>{flight.destination}</td>
      <td style={tdStyle}>{formatDate(flight.departureDateTime)}</td>
      <td style={tdStyle}>{formatTime(flight.departureDateTime)}</td>
      <td style={tdStyle}>{formatTime(flight.arrivalDateTime)}</td>
      <td style={tdStyle}>{flight.aircraft}</td>
      <td style={tdStyle}>{flight.price}</td>
      <td style={tdStyle}>{flight.seatsAvailable}</td>
      <td style={tdStyle}>
        {
          flight.seatsAvailable > 0 
          ? <Link href={'/booking?flightID=' + flight._id}>Book</Link>
          : <span>Full</span>
        }
      </td>
    </tr>
  );
}

return (
  <div style={{ padding: '20px' }}>
    <h1>Available Flights</h1>
    <div style={{marginBottom: '20px'}}>
      <h2>Search Flights</h2>

      <label>
        Origin:
        <select value={origin} onChange={handleOriginChange}>
          <option value="">All</option>
          <option value="Dairy Flat">Dairy Flat</option>
          <option value="Sydney">Sydney</option>
          <option value="Rotorua">Rotorua</option>
          <option value="Great Barrier Island">Great Barrier Island</option>
          <option value="Chatham Islands">Chatham Islands</option>
          <option value="Lake Tekapo">Lake Tekapo</option>
        </select>
      </label>

      <br />
      <br />

      <label>
        Destination:
        <select value={destination} onChange={handleDestinationChange}>
          <option value="">All</option>
          <option value="Dairy Flat">Dairy Flat</option>
          <option value="Sydney">Sydney</option>
          <option value="Rotorua">Rotorua</option>
          <option value="Great Barrier Island">Great Barrier Island</option>
          <option value="Chatham Islands">Chatham Islands</option>
          <option value="Lake Tekapo">Lake Tekapo</option>
        </select>
      </label>

      <br />
      <br />

      <label>
        Date:
        <input type="date" value={date} onChange={handleDateChange} />
      </label>

      <br />
      <br />

      <button onClick={fetchFlights}>Search</button>
      <button onClick={clearSearch}>Clear</button>
    </div>

    {loading && <p>Loading Flights...</p>}
    {error && <p style={{color: 'red'}}>{error}</p>}
    {!loading && !error && flights.length === 0 && (<p>No Flights Found.</p>)}
    {!loading && !error && flights.length > 0 && (<table border="1" cellPadding="8" style={{borderCollapse: 'collapse'}}>
      <thead>
        <tr>
          <th>Flight</th>
          <th>From</th>
          <th>To</th>
          <th>Date</th>
          <th>Departs</th>
          <th>Arrives</th>
          <th>Aircraft</th>
          <th>Price</th>
          <th>Seats</th>
          <th>Book</th>
        </tr>
      </thead>

      <tbody>
        {flightRows}
      </tbody>
    </table>
  )}
  </div>
);
}
const tdStyle = { padding: '8px'};