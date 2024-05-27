'use server';

import {Role, StaffPosition} from "@prisma/client";
import {z} from "zod";
import prisma from "@/lib/db";
import {getServerSession, User} from "next-auth";
import {writeDossier} from "@/actions/dossier";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";
import {authOptions} from "@/auth/auth";

const DEV_MODE = process.env.NODE_ENV === 'development';

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

export const saveRoles = async (user: User, roles: Role[], dossier: string) => {
    const rolesZ = z.object({
        roles: z.array(z.string()),
        dossier: z.string().min(1, 'Dossier entry is required'),
    });

    const result = rolesZ.parse({
        roles,
        dossier,
    });

    const session = await getServerSession(authOptions);
    if (!DEV_MODE && session?.user?.id === user.id) {
        throw new Error("You cannot change your own roles.");
    }

    if (result.roles.includes("MENTOR") && result.roles.includes("INSTRUCTOR")) {
        throw new Error("You must pick either MENTOR or INSTRUCTOR, not both.");
    }

    const savedRoles = await prisma.user.update({
        where: {id: user.id},
        data: {
            roles: {
                set: result.roles as Role[],
            },
        },
    });

    await writeDossier(dossier, user.cid);
    await log("UPDATE", "ROLE", `Roles updated for ${user.cid}`);
    revalidatePath(`/admin/staff/${user.cid}`);
    revalidatePath(`/controllers/roster`);
    return savedRoles;
}