import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('airline-booking');
        const { searchParams } = new URL(request.url);
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');
        const date = searchParams.get('date');

        //build the filter
        const filter = {};
        if (origin) filter.origin = origin;
        if (destination) filter.destination = destination;
        if (date) {
            const startOfDay = new Date(date);
            const endOfDay = new DataTransfer(date);
            endOfDay.setData(endOfDay.getDate()+1);
            filter.departDateTime = {
                $gte: startOfDay,
                $lt: endOfDay,
            };
        }

        const flights = await db.collection('flights').find(filter).sort({ departDateTime: 1}).toArray();
        return Response.json(flights);
    } catch (e) {
        return Response.json({error: e.message}, {status: 500});
    }
}