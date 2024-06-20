import prisma from "@/lib/db";
import {getVatusaData} from "@/auth/vatsimProvider";
import {User} from "next-auth";
import {revalidatePath} from "next/cache";
export const dynamic = 'force-dynamic';

export async function GET() {

    const users = await prisma.user.findMany();

    for (const user of users) {
        if (!user.excludedFromVatusaRosterUpdate) {
            const vatusaData = await getVatusaData(user as User);
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    controllerStatus: vatusaData.controllerStatus,
                    roles: {
                        set: vatusaData.roles,
                    },
                    staffPositions: {
                        set: vatusaData.staffPositions,
                    },
                },
            });
        }
    }

    const now = new Date();

    const syncTimes = await prisma.syncTimes.findFirst();

    if (syncTimes) {
        // If a syncTimes object exists, update the events field
        await prisma.syncTimes.update({
            where: {id: syncTimes.id},
            data: {roster: now},
        });
    } else {
        // If no syncTimes object exists, create a new one
        await prisma.syncTimes.create({
            data: {roster: now},
        });
    }

    revalidatePath('/', 'layout');

    return Response.json({ok: true,});
}