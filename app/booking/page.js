'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Booking() {
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [formError, setFormError] = useState(null);

  const router = useRouter();

  useEffect(function () {
    const params = new URLSearchParams(window.location.search);
    const flightId = params.get('flightId');

    if (!flightId) {
      setError('No flight selected.');
      setLoading(false);
      return;
    }

    async function loadFlight() {
      try {
        const response = await fetch('/api/flights/' + flightId);
        const data = await response.json();

        if (!response.ok) {
          setError('Flight not found.');
          setLoading(false);
          return;
        }

        setFlight(data);
        setLoading(false);
      } catch (e) {
        setError('Failed to load flight details.');
        setLoading(false);
      }
    }

    loadFlight();
  }, []);

  function handleNameChange(event) {
    setPassengerName(event.target.value);
  }

  function handleEmailChange(event) {
    setPassengerEmail(event.target.value);
  }

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

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);

    if (!passengerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!passengerEmail.trim()) {
      setFormError('Please enter your email address.');
      return;
    }

    if (!passengerEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flightId: flight._id.toString(),
          passengerName: passengerName,
          passengerEmail: passengerEmail
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || 'Booking failed. Please try again.');
        setSubmitting(false);
        return;
      }

      router.push('/confirmation?ref=' + data.bookingReference);
    } catch (e) {
      setFormError('Booking failed. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '20px' }}><p>Loading flight details...</p></div>;
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
      <h1>Book a Flight</h1>

      <div style={{ background: '#f0f4ff', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0 }}>Flight Details</h2>
        <table cellPadding="6">
          <tbody>
            <tr>
              <td><strong>Flight:</strong></td>
              <td>{flight.flightNumber}</td>
            </tr>
            <tr>
              <td><strong>From:</strong></td>
              <td>{flight.origin}</td>
            </tr>
            <tr>
              <td><strong>To:</strong></td>
              <td>{flight.destination}</td>
            </tr>
            <tr>
              <td><strong>Date:</strong></td>
              <td>{formatDate(flight.departureDateTime)}</td>
            </tr>
            <tr>
              <td><strong>Departs:</strong></td>
              <td>{formatTime(flight.departureDateTime)}</td>
            </tr>
            <tr>
              <td><strong>Arrives:</strong></td>
              <td>{formatTime(flight.arrivalDateTime)}</td>
            </tr>
            <tr>
              <td><strong>Aircraft:</strong></td>
              <td>{flight.aircraft}</td>
            </tr>
            <tr>
              <td><strong>Price:</strong></td>
              <td>${flight.price}</td>
            </tr>
            <tr>
              <td><strong>Seats Available:</strong></td>
              <td>{flight.seatsAvailable}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Passenger Details</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label>
            <strong>Full Name:</strong><br />
            <input
              type="text"
              value={passengerName}
              onChange={handleNameChange}
              placeholder="John Smith"
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>
            <strong>Email Address:</strong><br />
            <input
              type="email"
              value={passengerEmail}
              onChange={handleEmailChange}
              placeholder="john@example.com"
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </label>
        </div>

        {formError && <p style={{ color: 'red' }}>{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{ padding: '10px 24px', marginRight: '12px' }}
        >
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </button>

        <a href="/flights">Cancel</a>
      </form>
    </div>
  );
}