import prisma from "@/lib/db";
import {getVatusaData} from "@/auth/vatsimProvider";
import {User} from "next-auth";
import {revalidatePath} from "next/cache";
import {refreshAccountData} from "@/actions/user";
import {updateSyncTime} from "@/actions/lib/sync";
import {getOperatingInitials} from "@/actions/lib/oi";

export const dynamic = 'force-dynamic';

export async function GET() {

    const users = await prisma.user.findMany();

    for (const user of users) {
        if (!user.excludedFromVatusaRosterUpdate) {
            const vatusaData = await getVatusaData(user as User, users as User[]);
            let newOperatingInitials = user.operatingInitials;
            if (vatusaData.controllerStatus === "NONE" && user.controllerStatus !== "NONE") {
                newOperatingInitials = null;
            } else if (vatusaData.controllerStatus !== "NONE" && user.controllerStatus === "NONE") {
                newOperatingInitials = await getOperatingInitials(user.firstName || '', user.lastName || '', users.map(user => user.operatingInitials).filter(initial => initial !== null) as string[]);
            }
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    controllerStatus: vatusaData.controllerStatus,
                    operatingInitials: newOperatingInitials,
                    roles: {
                        set: vatusaData.roles,
                    },
                    staffPositions: {
                        set: vatusaData.staffPositions,
                    },
                },
            });
        }
        await refreshAccountData(user as User, true);
    }

    await updateSyncTime({roster: new Date()});

    revalidatePath('/', 'layout');

    return Response.json({ok: true,});
}