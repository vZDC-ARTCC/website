'use server';

import {StaffPosition} from "@prisma/client";
import {z} from "zod";
import prisma from "@/lib/db";
import {User} from "next-auth";
import {writeDossier} from "@/actions/dossier";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";

export const saveStaffPositions = async (user: User, staffPositions: StaffPosition[] | string[], dossier: string) => {
    const staffPositionsZ = z.object({
        staffPositions: z.array(z.string()),
        dossier: z.string().min(1, 'Dossier entry is required'),
    });

    const result = staffPositionsZ.parse({
        staffPositions,
        dossier,
    });

    const roles = user.roles;
    if (staffPositions.length > 0 && !roles.includes("STAFF")) {
        roles.push("STAFF");
    } else if (staffPositions.length === 0 && roles.includes("STAFF")) {
        roles.splice(roles.indexOf("STAFF"), 1);
    }

    const savedStaffPositions = await prisma.user.update({
        where: {id: user.id},
        data: {
            roles: {
                set: roles,
            },
            staffPositions: {
                set: (result.staffPositions.filter((v) => !!v)) as StaffPosition[],
            },
        },
    });
    await writeDossier(dossier, user.cid);
    await log("UPDATE", "STAFF_POSITION", `Staff positions updated for ${user.cid}`);
    revalidatePath(`/admin/staff/${user.cid}`);
    revalidatePath(`/controllers/roster`);
    return savedStaffPositions;
}