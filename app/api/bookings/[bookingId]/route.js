import {NextResponse} from "next/server";
import {getDb} from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function GET(_req, {params}) {
    try {
        const {bookingId} = await params;
        const db = await getDb();
        const bookingsCol = db.collection("bookings");

        const booking = await bookingsCol.findOne({ bookingReference: bookingId }); 

        if (!booking) { 
            return NextResponse.json({error: "Booking not found"}, {status: 404});
        }

        return NextResponse.json( {
        bookingReference: booking.bookingReference,
        passengerName: booking.passengerName,
        passengerEmail: booking.passengerEmail,
        seats: booking.seats,
        flightId: booking.flightId?.toString(),
        flightNumber: booking.flightNumber,
        origin: booking.origin,
        destination: booking.destination,
        departureDateTime: booking.departureDateTime,
        arrivalDateTime: booking.arrivalDateTime,
        aircraft: booking.aircraft,
        price: booking.price,
        bookedAt: booking.bookedAt
        }, {status: 200});
    } catch (e) {
        console.error("GET booking error:", e);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

export async function DELETE(_req, {params}) {
    try {
        const {bookingId} = await params;
        const db = await getDb();
        const bookingsCol = db.collection("bookings");

        const booking = await bookingsCol.findOne({ bookingReference: bookingId });

        if (!booking) {
            return NextResponse.json({error: "Booking not found"}, {status: 404});
        }

        const seatsToFree = booking?.seats ?? 1;

        await bookingsCol.deleteOne({ bookingReference: bookingId });
        await db.collection("flights").updateOne(
            { _id: booking.flightId },
            { $inc: { seatsAvailable: seatsToFree } }
        );

        return NextResponse.json({message: "Booking cancelled", bookingId}, {status: 200});

    } catch (e) {
        console.error("GET deletion error:", e);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}