import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, {params}) {
    try {
        const { id } = await params;
        const client = await clientPromise;
        const db = client.db('airline-booking');

        const flight = await db.collection('flights').findOne({_id: new ObjectId(id)});
        if (!flight) {
            return Response.json({error: 'Flight not found'}, {status: 404});
        }

        return Response.json(flight);
    } catch (e) {
        return Response.json({error: e.message}, {status: 500});
    }
}