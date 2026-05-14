import {getDb} from '@/lib/mongodb';

export async function GET(request) {
    try {
        const db = await getDb();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return Response.json({error: 'Email is required'}, {status: 400});
        }

        const bookings = await db.collection('bookings').find({passengerEmail: email.toLowerCase().trim() }).sort({ departureDateTime: 1}).toArray();
        return Response.json(bookings);
    } catch (e) {
        return Response.json({error: e.message}, {status: 500});
    }
}