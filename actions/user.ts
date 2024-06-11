'use server';

import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {writeDossier} from "@/actions/dossier";
import {log} from "@/actions/log";

export const updateSettings = async (formData: FormData) => {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) return;

    const settingsZ = z.object({
        id: z.string().min(1, "Invalid ID"),
        noRequestLoas: z.boolean(),
        noEventSignup: z.boolean(),
        noEditProfile: z.boolean(),
        excludedFromVatusaRosterUpdate: z.boolean(),
        hiddenFromRoster: z.boolean(),
        dossier: z.string().min(1, "Invalid dossier"),
    });

    const result = settingsZ.parse({
        id: formData.get("id") as string,
        noRequestLoas: formData.get("allowedLoas") !== "on",
        noEventSignup: formData.get("allowedEventSignup") !== "on",
        noEditProfile: formData.get("allowedEditProfile") !== "on",
        excludedFromVatusaRosterUpdate: formData.get("excludedRosterUpdate") === "on",
        hiddenFromRoster: formData.get("hiddenFromRoster") === "on",
        dossier: formData.get("dossier") as string,
    });

    const user = await prisma.user.update({
        data: {
            noRequestLoas: result.noRequestLoas,
            noEventSignup: result.noEventSignup,
            noEditProfile: result.noEditProfile,
            excludedFromVatusaRosterUpdate: result.excludedFromVatusaRosterUpdate,
            hiddenFromRoster: result.hiddenFromRoster,
        },
        where: {
            id: result.id,
        }
    });

    await writeDossier(result.dossier, user.cid);

    await log("UPDATE", "USER_SETTINGS", `User settings updated for ${user.firstName} ${user.lastName} (${user.cid})`,);

    revalidatePath('/', "layout");
    return null;
}