import {NextResponse} from "next/server";
import {getDb} from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function GET(_req, {params}) {
    try {
        const {bookingId} = params;
        const db = await getDb();
        const schedulesCol = db.collection("schedules");

        //find the schdedule containing boooking
        const schedule = await schedulesCol.findOne({
            "booking.bookingId": bookingId
        });

        if (!schedule) {
            return NextResponse.json({error: "Booking not found"}, {status: 404});
        }

        //extract booking
        const booking = schedule.bookings.find((b) => b.bookingId === bookingId);

        //return booking and flight id
        return NextResponse.json(
            {
                id: booking.bookingId,
                passengerName: booking.passengerName,
                passengerEmail: booking.passengerEmail,
                seats: booking.seats,
                flightId: schedule._id.toString(),
                createdAt: booking.createdAt
            }, {status: 200}
        );
    } catch (e) {
        console.error("GET booking error:", e);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

export async function DELETE(_req, {params}) {
    try {
        const {bookingId} = params;
        const db = await getDb();
        const schedulesCol = db.collection("schedules");

        //find schedule conatining booking
        const schedule = await schedulesCol.findONe({"bookings.bookingId": bookingId});

        if (!schedule) {
            return NextResponse.json({error: "Booking not found"}, {status: 404});
        }

        //find booking to know how many seats to free
        const booking = schedule.bookings.find((b) => b.bookingId === bookingId);
        const seatsToFree = booking?.seats ?? 1;

        //remove booking + decrement bookedSeats
        await schedulesCol.updateOne({_id: schedule._id},
            {
                $pull: {bookings: {bookingId}},
                $inc: {bookedSeats: -seatsToFree}
            }
        );

        return NextResponse.json({message: "Booking cancelled", bookingId}, {status: 200});

    } catch (e) {
        console.error("GET booking error:", e);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}