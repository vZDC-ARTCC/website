import {deleteStaleEvents, lockUpcomingEvents} from "@/actions/event";
import {revalidatePath} from "next/cache";
import {updateSyncTime} from "@/actions/lib/sync";

export const dynamic = 'force-dynamic';

export async function GET() {
    await lockUpcomingEvents();
    await deleteStaleEvents();

    await updateSyncTime({events: new Date(),});

    revalidatePath('/', 'layout');

    return Response.json({ok: true,});
}