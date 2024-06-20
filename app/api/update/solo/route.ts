import {deleteExpiredSolos} from "@/actions/solo";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
export const dynamic = 'force-dynamic';

export async function GET() {

    await deleteExpiredSolos();

    const now = new Date();

    const syncTimes = await prisma.syncTimes.findFirst();

    if (syncTimes) {
        // If a syncTimes object exists, update the events field
        await prisma.syncTimes.update({
            where: {id: syncTimes.id},
            data: {soloCert: now},
        });
    } else {
        // If no syncTimes object exists, create a new one
        await prisma.syncTimes.create({
            data: {soloCert: now},
        });
    }

    revalidatePath('/', 'layout');

    return Response.json({ok: true,});
}