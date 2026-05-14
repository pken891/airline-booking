import { getDb } from "@/lib/mongodb";

export async function GET(request) {
    try {
        const db = await getDb();
        const { searchParams } = new URL(request.url);
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');
        const date1 = searchParams.get('date1');
        const date2 = searchParams.get('date2');

        const filter = {};
        if (origin) filter.origin = origin;
        if (destination) filter.destination = destination;

        if (date1 || date2) {
            filter.departureDateTime = {};
            if (date1) filter.departureDateTime.$gte = new Date(date1);
            if (date2) {
                const end = new Date(date2);
                end.setDate(end.getDate() + 1); // inclusive of the end date
                filter.departureDateTime.$lt = end;
            }
        }

        const flights = await db.collection('flights').find(filter).sort({ departureDateTime: 1 }).toArray();
        return Response.json(flights);
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}