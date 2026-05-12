'use client';

import { useState, useEffect } from 'react';

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
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-NZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  function formatBookedAt(dateString) {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  if (loading) {
    return <div style={{ padding: '20px' }}><p>Loading booking details...</p></div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <a href="/flights">Back to Flights</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>

      <div style={{ background: '#e6ffe6', border: '2px solid green', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ color: 'green', marginTop: 0 }}>✅ Booking Confirmed!</h1>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Booking Reference: {booking.bookingReference}</p>
        <p>Please save this reference for your records.</p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h2 style={{ marginTop: 0 }}>Flight Details</h2>
        <table cellPadding="8" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td><strong>Flight Number:</strong></td>
              <td>{booking.flightNumber}</td>
            </tr>
            <tr>
              <td><strong>From:</strong></td>
              <td>{booking.origin}</td>
            </tr>
            <tr>
              <td><strong>To:</strong></td>
              <td>{booking.destination}</td>
            </tr>
            <tr>
              <td><strong>Date:</strong></td>
              <td>{formatDate(booking.departureDateTime)}</td>
            </tr>
            <tr>
              <td><strong>Departs:</strong></td>
              <td>{formatTime(booking.departureDateTime)}</td>
            </tr>
            <tr>
              <td><strong>Arrives:</strong></td>
              <td>{formatTime(booking.arrivalDateTime)}</td>
            </tr>
            <tr>
              <td><strong>Aircraft:</strong></td>
              <td>{booking.aircraft}</td>
            </tr>
            <tr>
              <td><strong>Price:</strong></td>
              <td>${booking.price}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h2 style={{ marginTop: 0 }}>Passenger Details</h2>
        <table cellPadding="8" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{booking.passengerName}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{booking.passengerEmail}</td>
            </tr>
            <tr>
              <td><strong>Booked At:</strong></td>
              <td>{formatBookedAt(booking.bookedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={function () { window.print(); }}>
          Print / Save as PDF
        </button>
        <a href="/flights">Book Another Flight</a>
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}