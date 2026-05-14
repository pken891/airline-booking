'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MyBookings() {
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);
    const [cancellingRef, setCancellingRef] = useState(null);
    const [cancelMessage, setCancelMessage] = useState(null);

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-NZ', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
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
    async function handleSearch(e) {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        setLoading(true);
        setError(null);
        setCancelMessage(null);
        setSearched(false);

        try {
            const response = await fetch('/api/passengers?email=' + encodeURIComponent(email.trim()));
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to fetch bookings.');
                setLoading(false);
                return;
            }
            setBookings(data);
            setSearched(true);
            setLoading(false);
        } catch (e) {
            setError('Failed to fetch bookings. Please try again');
            setLoading(false);
        }
    }

    async function handleCancel(bookingReference) {
        if (!confirm('Are you sure you want to cancel booking ' + bookingReference + '?')) return;

        setCancellingRef(bookingReference);
        setCancelMessage(null);

        try {
            const response = await fetch('/api/bookings/' + bookingReference, { method: 'DELETE' });
            const data = await response.json();

            if (!response.ok) {
                setCancelMessage({ type: 'error', text: data.error || 'Cancellation failed.' });
                setCancellingRef(null);
                return;
            }

            setBookings(prev => prev.filter(b => b.bookingReference !== bookingReference));
            setCancelMessage({ type: 'success', text: 'Booking ' + bookingReference + ' has been cancelled.' });
            setCancellingRef(null);
        } catch (e) {
            setCancelMessage({ type: 'error', text: 'Cancellation failed. Please try again' });
            setCancellingRef(null);
        }
    }

    const now = new Date();
    const upcomingBookings = bookings.filter(b => new Date(b.departureDateTime) >= now);
    const pastBookings = bookings.filter(b => new Date(b.departureDateTime) < now);

    function BookingCard({ booking, allowCancel }) {
        const isPast = new Date(booking.departureDateTime) < now;
        return (
            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                background: isPast ? '#fafafa' : '#fff',
                opacity: isPast ? 0.8 : 1
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{booking.flightNumber}</span>
                        <span style={{ marginLeft: '12px', color: '#555' }}>
                            {booking.origin} → {booking.destination}
                        </span>
                    </div>
                    <span style={{
                        background: isPast ? '#eee' : '#e6f4ea',
                        color: isPast ? '#666' : '#2d6a2d',
                        borderRadius: '4px',
                        padding: '2px 10px',
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}>
                        {isPast ? 'Completed' : 'Upcoming'}
                    </span>
                </div>

                <table cellPadding="4" style={{ marginTop: '12px', fontSize: '14px' }}>
                    <tbody>
                        <tr>
                            <td style={{ color: '#666', width: '130px' }}>Booking ref:</td>
                            <td><strong>{booking.bookingReference}</strong></td>
                        </tr>
                        <tr>
                            <td style={{ color: '#666' }}>Date:</td>
                            <td>{formatDate(booking.departureDateTime)}</td>
                        </tr>
                        <tr>
                            <td style={{ color: '#666' }}>Departs:</td>
                            <td>{formatTime(booking.departureDateTime)}</td>
                        </tr>
                        <tr>
                            <td style={{ color: '#666' }}>Arrives:</td>
                            <td>{formatTime(booking.arrivalDateTime)}</td>
                        </tr>
                        <tr>
                            <td style={{ color: '#666' }}>Aircraft:</td>
                            <td>{booking.aircraft}</td>
                        </tr>
                        <tr>
                            <td style={{ color: '#666' }}>Price:</td>
                            <td>${booking.price}</td>
                        </tr>
                    </tbody>
                </table>

                {allowCancel && (
                    <div style={{ marginTop: '12px' }}>
                        <button
                            onClick={() => handleCancel(booking.bookingReference)}
                            disabled={cancellingRef === booking.bookingReference}
                            style={{
                                padding: '6px 16px',
                                background: '#fff',
                                border: '1px solid #c00',
                                color: '#c00',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {cancellingRef === booking.bookingReference ? 'Cancelling...' : 'Cancel booking'}
                        </button>
                    </div>
                )}
            </div>
        );
    }
    return (
        <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
            <h1>My Bookings</h1>
            <p style={{ color: '#555' }}>Enter your email address to view all your flights.</p>
            <form onSubmit={handleSearch} style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={{ padding: '8px 12px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc', flex: '1', minWidth: '220px' }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '8px 20px', fontSize: '15px', borderRadius: '6px', border: '1px solid #0057b8', background: '#0057b8', color: '#fff', cursor: 'pointer' }}
                    >
                        {loading ? 'Searching...' : 'Find my bookings'}
                    </button>
                </div>
                {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
            </form>

            {cancelMessage && (
                <p style={{ color: cancelMessage.type === 'success' ? 'green' : 'red', marginBottom: '16px' }}>
                    {cancelMessage.text}
                </p>
            )}

            {searched && bookings.length === 0 && (
                <p>No bookings found for <strong>{email}</strong>. Double-check your email address.</p>
            )}

            {searched && bookings.length > 0 && (
                <>
                    <p style={{ color: '#555', marginBottom: '20px' }}>Found <strong>{bookings.length}</strong> booking{bookings.length !== 1 ? 's' : ''} for <strong>{email}</strong>.</p>
                    {upcomingBookings.length > 0 && (
                        <>
                            <h2>Upcoming flights ({upcomingBookings.length})</h2>
                            {upcomingBookings.map(b => (
                                <BookingCard key={b.bookingReference} booking={b} allowCancel={true} />
                            ))}
                        </>
                    )}

                    {pastBookings.length > 0 && (
                        <>
                            <h2>Past flights ({pastBookings.length})</h2>
                            {pastBookings.map(b => (
                                <BookingCard key={b.bookingReference} booking={b} allowCancel={false} />
                            ))}
                        </>
                    )}
                </>
            )}

            <div style={{ marginTop: '32px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                <Link href="/">← Back to home</Link>
            </div>
        </div>
    );
}