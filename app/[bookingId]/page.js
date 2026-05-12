import React from "react";
import Link from 'next/link';

export default async function BookingConfirmation({ params }) {
    const {bookingId} = params;

    //fetch booking details
    const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}`, {cache: "no-store"});

    if (!bookingRes.ok) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">Booking Not Found</h1>
                <p className="mt-4">We couldnt find your booking with that reference</p>
            </div>
        );
    }

    const booking = await bookingRes.json();

    //fetch flight detaisl
    const flightRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/flights/${booking.flightId}`, {cache: "no-store"});
    const flight = await flightRes.json();

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-md mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Booking Confirmation
            </h1>

            <div className="border p-4 rounded-md bg-gray-50">
                <h2 className="text-xl font-semibold mb-2">Booking Reference</h2>
                <p className="text-lg font-semibold mb-2">{booking.id}</p>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Passenger Details</h2>
                <p><strong>Name:</strong>{booking.passengerName}</p>
                <p><strong>Email:</strong>{booking.passengerEmail}</p>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Flight Details</h2>
                <p><strong>Flight Number:</strong>{flight.flightNumber}</p>
                <p><strong>Origin:</strong>{flight.origin}</p>
                <p><strong>Destination:</strong>{flight.destination}</p>
                <p><strong>Departure:</strong>{new Date(flight.departureTime).toLocaleString()}</p>
                <p><strong>Arrival:</strong>{new Date(flight.arrivalTime).toLocaleString()}</p>
                <p><strong>Aircraft:</strong>{flight.aircraftType}</p>
            </div>

            <div className="mt-6 border-t pt-4">
                <h2 className="text-xl font-semibold mb-2">Price</h2>
                <p className="text-2xl font-bold">${flight.price}</p>
            </div>

            <div className="mt-8 text-center">
                <Link 
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Return to Home
                </Link>
            </div>
        </div>
    )
}