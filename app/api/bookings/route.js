import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function generateBookingRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BK-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { flightId, passengerName, passengerEmail } = body;

    if (!flightId || !passengerName || !passengerEmail) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();

    // Find flight
    const flight = await db.collection('flights').findOne({ _id: new ObjectId(flightId) });

    if (!flight) {
      return Response.json({ error: 'Flight not found' }, { status: 404 });
    }

    if (flight.seatsAvailable <= 0) {
      return Response.json({ error: 'No seats available on this flight' }, { status: 400 });
    }

    // Generate booking reference
    let bookingReference;
    let isUnique = false;
    while (!isUnique) {
      bookingReference = generateBookingRef();
      const existing = await db.collection('bookings').findOne({ bookingReference });
      if (!existing) isUnique = true;
    }

    // Create the booking
    const booking = {
      bookingReference,
      flightId: flight._id,
      flightNumber: flight.flightNum,
      passengerName,
      passengerEmail,
      origin: flight.origin,
      destination: flight.destination,
      aircraft: flight.aircraft,
      departureDateTime: flight.departureDateTime,
      arrivalDateTime: flight.arrivalDateTime,
      price: flight.price,
      bookedAt: new Date()
    };

    await db.collection('bookings').insertOne(booking);

    // Decrement available seats
    await db.collection('flights').updateOne(
      { _id: flight._id },
      { $inc: { seatsAvailable: -1 } }
    );

    return Response.json(booking, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}