'use server';

import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {log} from "@/actions/log";

const VATUSA_FACILITY = process.env.VATUSA_FACILITY;
const VATUSA_API_KEY = process.env.VATUSA_API_KEY;

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
        const res = await fetch(`https://api.vatusa.net/v2/facility/${VATUSA_FACILITY}/roster/${user.cid}?apiKey=${VATUSA_API_KEY}`, {
            method: "DELETE",
        });
        const data = await res.json();
        console.log(data);
    }

    revalidatePath("/controllers/roster", "layout");
    revalidatePath("/admin/purge-assistant");
    return users;
}