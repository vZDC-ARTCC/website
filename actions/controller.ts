'use server';

import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {log} from "@/actions/log";
import {removeVatusaController} from "@/actions/vatusa/roster";
import {sendRosterRemovalEmail} from "@/actions/mail/controller";
import {User} from "next-auth";

export const purgeControllers = async (ids: string[]) => {

    const users = await prisma.user.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });

    await prisma.user.updateMany({
        where: {
            id: {
                in: ids,
            },
        },
        data: {
            controllerStatus: "NONE",
            staffPositions: {
                set: [],
            },
            roles: {
                set: [],
            },
        },
    });

    for (const user of users) {
        await log("DELETE", "USER", `Purged user ${user.firstName} ${user.lastName} (${user.cid}) from roster.`);
        await removeVatusaController(user.cid, user.controllerStatus === "VISITOR");
        await sendRosterRemovalEmail(user as User);
    }

    revalidatePath("/controllers/roster", "layout");
    revalidatePath("/admin/purge-assistant");
    return users;
}