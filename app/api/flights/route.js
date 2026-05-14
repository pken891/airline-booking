    import {getDb} from "@/lib/mongodb";

    export async function GET(request) {
        try {
            const db = await getDb();
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
                const endOfDay = new Date(date);
                endOfDay.setDate(endOfDay.getDate()+1);
                filter.departureDateTime = {
                    $gte: startOfDay,
                    $lt: endOfDay,
                };
            }

            const flights = await db.collection('flights').find(filter).sort({ departureDateTime: 1}).toArray();
            return Response.json(flights);
        } catch (e) {
            return Response.json({error: e.message}, {status: 500});
        }
    }