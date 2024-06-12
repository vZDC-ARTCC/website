'use server';

import {VisitorApplication} from "@prisma/client";
import prisma from "@/lib/db";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {log} from "@/actions/log";
import {User} from "next-auth";
import {addVatusaVisitor} from "@/actions/vatusa/roster";
import {
    sendVisitorApplicationAcceptedEmail,
    sendVisitorApplicationCreatedEmail,
    sendVisitorApplicationRejectedEmail
} from "@/actions/mail/visitor";

export const addVisitingApplication = async (formData: FormData) => {

    const visitorZ = z.object({
        userId: z.string(),
        homeFacility: z.string().trim().min(1, "Home ARTCC is required"),
        whyVisit: z.string().trim().min(1, "Reason for visiting is required"),
        meetUsaReqs: z.boolean().refine((val) => val, "You must meet the VATUSA visiting requirements"),
        meetZdcReqs: z.boolean().refine((val) => val, "You must agree to our visiting policy"),
        goodStanding: z.boolean().refine((val) => val, "You must be in good standing with your home ARTCC"),
        notRealWorld: z.boolean().refine((val) => val, "You must understand that we are not the real world FAA nor do we have any affiliation with them"),
    });

    const result = visitorZ.safeParse({
        userId: formData.get('userId'),
        homeFacility: formData.get("homeFacility"),
        whyVisit: formData.get("whyVisit"),
        meetUsaReqs: formData.get("meetUsaReqs") === 'on',
        meetZdcReqs: formData.get("meetZdcReqs") === 'on',
        goodStanding: formData.get("goodStanding") === 'on',
        notRealWorld: formData.get("notRealWorld") === 'on',
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const existing = await prisma.visitorApplication.findFirst({
        where: {
            userId: result.data.userId,
            status: "PENDING",
        },
    });
    if (existing) {
        return {errors: [{message: "You already have a pending visitor application"},]};
    }

    const application = await prisma.visitorApplication.create({
        data: {
            homeFacility: result.data.homeFacility,
            whyVisit: result.data.whyVisit,
            user: {
                connect: {
                    id: result.data.userId,
                }
            },
            status: "PENDING",
            submittedAt: new Date(),
        },
        include: {
            user: true,
        },
    });

    await sendVisitorApplicationCreatedEmail(application.user as User);

    revalidatePath('/admin/visitor-applications');
    revalidatePath('/visitor/new');
    return {application};
}

export const addVisitor = async (application: VisitorApplication, user: User) => {
    if (application.status !== "PENDING") return;

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            controllerStatus: "VISITOR",
        },
    });
    await prisma.visitorApplication.update({
        where: {
            id: application.id,
        },
        data: {
            status: "APPROVED",
            decidedAt: new Date(),
        },
        include: {
            user: true,
        },
    });

    await log("UPDATE", "VISITOR_APPLICATION", `Approved visitor application for ${user.fullName} (${user.cid})`);

    await addVatusaVisitor(user.cid);

    await sendVisitorApplicationAcceptedEmail(user);

    revalidatePath('/controllers/roster');
    revalidatePath('/admin/visitor-applications');
    revalidatePath(`/admin/visitor-applications/${application.id}`);
    revalidatePath('/visitor/new');
}

export const rejectVisitor = async (application: VisitorApplication, user: User) => {
    if (application.status !== "PENDING") return;
    await prisma.visitorApplication.update({
        where: {
            id: application.id,
        },
        data: {
            status: "DENIED",
            decidedAt: new Date(),
            reasonForDenial: application.reasonForDenial,
        },
        include: {
            user: true,
        },
    });

    await sendVisitorApplicationRejectedEmail(user);

    await log("UPDATE", "VISITOR_APPLICATION", `Rejected visitor application for ${user.fullName} (${user.cid})`);
    revalidatePath('/admin/visitor-applications');
    revalidatePath(`/admin/visitor-applications/${application.id}`);
    revalidatePath('/visitor/new');
}