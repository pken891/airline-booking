import clientPromise from "@/lib/mongodb";

export async function GET(request, {params}) {
    try {
        const {reference} = await params;
        const client = await clientPromise;
        const db = client.db('airline-booking');

        const booking = await db.collection('bookings').findONe({bookingReference: reference});

        if (!booking) {
            return Response.json({error: 'Booking not found'}, {status: 404});
        }

        return Response.json(booking);
    } catch (e) {
        return Response.json({error: e.message}, { status: 500});
    }
}