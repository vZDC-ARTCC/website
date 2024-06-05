'use server';

import {z} from "zod";
import prisma from "@/lib/db";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";
import {
    sendLoaApprovedEmail,
    sendLoaDeletedEmail,
    sendLoaDeniedEmail,
    sendLoaExpiredEmail,
    sendLoaRequestedEmail
} from "@/actions/mail/loa";

export const createOrUpdateLoa = async (formData: FormData) => {
    const loaZ = z.object({
        loaId: z.string().optional(),
        start: z.date({required_error: "You must select a start date."}),
        end: z.date({required_error: "You must select an end date."}).refine(end => {
            const dateStart = new Date(formData.get("start") as string);
            const dateEnd = new Date(end);
            const diffTime = Math.abs(dateEnd.getTime() - dateStart.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays >= 7;
        }, {message: "End date must be at least 7 days after start date."}),
        reason: z.string().min(1, "Reason is required"),
    });

    const result = loaZ.safeParse({
        loaId: formData.get("id") as string,
        start: new Date(formData.get("start") as string),
        end: new Date(formData.get("end") as string),
        reason: formData.get("reason") as string,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const session = await getServerSession(authOptions);

    if (result.data.loaId && session) {
        const loa = await prisma.lOA.update({
            where: {
                id: result.data.loaId,
            },
            data: {
                start: result.data.start,
                end: result.data.end,
                reason: result.data.reason,
                status: "PENDING",
            },
        });

        await log("UPDATE", "LOA", `User ${session.user.firstName} ${session.user.lastName} updated LOA request`);
        revalidatePath("/profile", "layout");
        return {loa};
    } else if (session) {
        const loa = await prisma.lOA.create({
            data: {
                start: result.data.start,
                end: result.data.end,
                reason: result.data.reason,
                userId: session.user.id,
                status: "PENDING",
            },
        });

        await sendLoaRequestedEmail(session.user, loa);

        await log("CREATE", "LOA", `User ${session.user.firstName} ${session.user.lastName} requested LOA`);
        revalidatePath("/profile", "layout");
        return {loa};
    }

    return {loa: null};
}

export const deleteLoa = async (loaId: string) => {
    const loa = await prisma.lOA.delete({
        where: {
            id: loaId,
        },
        include: {
            user: true,
        },
    });

    await sendLoaDeletedEmail(loa.user as User, loa);

    await log("DELETE", "LOA", `LOA request for ${loa.user.firstName} ${loa.user.lastName} (${loa.user.cid}) deleted`);
    revalidatePath("/profile", "layout");
    return {loa};
}

export const approveLoa = async (loaId: string) => {

    const loa = await prisma.lOA.update({
        where: {
            id: loaId,
        },
        data: {
            status: "APPROVED",
        },
        include: {
            user: true,
        }
    });

    await sendLoaApprovedEmail(loa.user as User, loa);
    await log("UPDATE", "LOA", `LOA request for ${loa.user.firstName} ${loa.user.lastName} (${loa.user.cid}) approved`);
    revalidatePath("/admin/loas", "layout");
    revalidatePath("/profile", "layout");
    return {loa};
}

export const denyLoa = async (loaId: string) => {

    const loa = await prisma.lOA.update({
        where: {
            id: loaId,
        },
        data: {
            status: "DENIED",
        },
        include: {
            user: true,
        }
    });

    await sendLoaDeniedEmail(loa.user as User, loa);
    await log("UPDATE", "LOA", `LOA request for ${loa.user.firstName} ${loa.user.lastName} (${loa.user.cid}) denied`);
    revalidatePath("/admin/loas", "layout");
    revalidatePath("/profile", "layout");
    return {loa};
}

export const deleteExpiredLoas = async () => {

    const expiredLoas = await prisma.lOA.findMany({
        where: {
            end: {
                lt: new Date(),
            },
        },
        include: {
            user: true,
        },
    });

    // For each expired LOA
    for (const loa of expiredLoas) {
        // Delete the LOA
        await prisma.lOA.delete({
            where: {
                id: loa.id,
            },
        });

        // Send the LOA deleted email to the user
        await sendLoaExpiredEmail(loa.user as User, loa);
    }

    const loas = await prisma.lOA.deleteMany({
        where: {
            end: {
                lt: new Date(),
            },
        },
    });

    revalidatePath("/profile", "layout");
    return {loas};
}