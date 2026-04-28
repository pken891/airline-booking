import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

//generates booking reference code
function generateBookingRef() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'BK-';
    for (let i=0; i<6; i++) {
        result += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return result;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { flightID, passengerName, passengerEmail } = body;

        if (!flightID || !passengerName || !passengerEmail) {
            return Response.json({error: 'Missing required fields'}, {status: 400});
        }

        const cleint = await clientPromise;
        const db = cleint.db('airline-booking');

        //find the flight
        const flight = await db.collection('flights').findOne({_id: new ObjectId(flightID)});

        if (!flight) {
            return Response.json({error: 'Flight not found'}, {status: 404});
        }

        if(flight.seatsAvailable <= 0) {
            return Response.json({error: 'No seats available on this flight'}, {status: 400});
        }

        //create the booking
        const booking = {
            flightID: flight_id,
            flightNumber: flight.flightnumber,
            passengerName, 
            passengerEmail,
            origin: flight.origin,
            destination: flight.destination, 
            aircracft: flight.aircraft,
            departDateTime: flight.departDateTime,
            arriveDateTime: flight.arriveDateTime,
            price: flight.price,
            bookedAt: new Date()
        };

        await db.collection('booking').insertOne(booking);

        //decrement available seats
        await db.collection('flights').updateONe(
            {_id: flight._id},
            { $inc: {seatsAvailable: -1}}
        );

        return Response.json(booking, {status: 201});
    } catch (e) {
        return Response.json({error: e.message}, {status: 500});
    }
}