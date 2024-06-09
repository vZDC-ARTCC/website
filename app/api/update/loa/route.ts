import {deleteExpiredLoas} from "@/actions/loa";
import prisma from "@/lib/db";

export async function GET() {

    await deleteExpiredLoas();

    const now = new Date();

    const syncTimes = await prisma.syncTimes.findFirst();

    if (syncTimes) {
        // If a syncTimes object exists, update the events field
        await prisma.syncTimes.update({
            where: {id: syncTimes.id},
            data: {loas: now},
        });
    } else {
        // If no syncTimes object exists, create a new one
        await prisma.syncTimes.create({
            data: {loas: now},
        });
    }

    return Response.json({ok: true,});
}