import {deleteStaleEvents, lockUpcomingEvents} from "@/actions/event";

export default async function GET() {
    await lockUpcomingEvents();
    await deleteStaleEvents();

    return Response.json({ok: true,});
}