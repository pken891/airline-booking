import { ObjectId } from "mongodb";
import {getDb} from "@/lib/mongodb";

export async function GET(request, {params}) {
    try {
        const { id } = await params;
        const db = await getDb();;

        const flight = await db.collection('flights').findOne({_id: new ObjectId(id)});
        if (!flight) {
            return Response.json({error: 'Flight not found'}, {status: 404});
        }

        return Response.json(flight);
    } catch (e) {
        return Response.json({error: e.message}, {status: 500});
    }
}