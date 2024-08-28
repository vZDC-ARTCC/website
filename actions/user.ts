'use server';

import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {writeDossier} from "@/actions/dossier";
import {log} from "@/actions/log";
import {getController} from "@/actions/vatusa/controller";

export const updateSettings = async (formData: FormData) => {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) return;

    const settingsZ = z.object({
        id: z.string().min(1, "Invalid ID"),
        noRequestLoas: z.boolean(),
        noEventSignup: z.boolean(),
        noEditProfile: z.boolean(),
        noRequestTrainingAssignments: z.boolean(),
        noRequestTrainerRelease: z.boolean(),
        excludedFromVatusaRosterUpdate: z.boolean(),
        hiddenFromRoster: z.boolean(),
        dossier: z.string().min(1, "Invalid dossier"),
    });

    const result = settingsZ.parse({
        id: formData.get("id") as string,
        noRequestLoas: formData.get("allowedLoas") !== "on",
        noEventSignup: formData.get("allowedEventSignup") !== "on",
        noEditProfile: formData.get("allowedEditProfile") !== "on",
        noRequestTrainingAssignments: formData.get("allowedTrainingRequests") !== "on",
        noRequestTrainerRelease: formData.get("allowedTrainerRelease") !== "on",
        excludedFromVatusaRosterUpdate: formData.get("excludedRosterUpdate") === "on",
        hiddenFromRoster: formData.get("hiddenFromRoster") === "on",
        dossier: formData.get("dossier") as string,
    });

    const user = await prisma.user.update({
        data: {
            noRequestLoas: result.noRequestLoas,
            noEventSignup: result.noEventSignup,
            noEditProfile: result.noEditProfile,
            noRequestTrainingAssignments: result.noRequestTrainingAssignments,
            noRequestTrainerRelease: result.noRequestTrainerRelease,
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

export const refreshAccountData = async (user: User, silent?: boolean,) => {

    if (user.updatedAt && new Date().getTime() - new Date(user.updatedAt).getTime() < 300000) {
        if (silent) return;
        return 'Please wait at least 5 minutes before refreshing your account information.';
    }

    const controller = await getController(user.cid);
    if (!controller) return;
    await prisma.user.update({
        data: {
            rating: controller.rating,
            email: controller.email,
            firstName: controller.fname,
            lastName: controller.lname,
            updatedAt: new Date(),
        },
        where: {
            id: user.id,
        }
    });

    revalidatePath('/', "layout");
}