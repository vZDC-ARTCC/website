'use server';

import {VisitorApplication} from "@prisma/client";
import prisma from "@/lib/db";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {log} from "@/actions/log";
import {User} from "next-auth";

const VATUSA_FACILITY = process.env.VATUSA_FACILITY || 'ZDC';
const VATUSA_API_KEY = process.env.VATUSA_API_KEY || '';

export const addVisitingApplication = async (data: VisitorApplication, user: User) => {

    const visitorZ = z.object({
        homeFacility: z.string().trim().min(1, "Home ARTCC is required"),
        whyVisit: z.string().trim().min(1, "Reason for visiting is required"),
    });

    const result = visitorZ.parse(data);

    const existing = await prisma.visitorApplication.findFirst({
        where: {
            userId: user.id,
            status: "PENDING",
        },
    });
    if (existing) {
        throw new Error("You already have a pending visitor application. Please wait for a decision before submitting another.");
    }

    await prisma.visitorApplication.create({
        data: {
            ...result,
            user: {
                connect: {
                    id: user.id,
                }
            },
            status: "PENDING",
            submittedAt: new Date(),
        },
    });
    revalidatePath('/admin/visitor-applications');
    revalidatePath('/visitor/new');
}

export const addVisitor = async (application: VisitorApplication, user: User) => {
    if (application.status !== "PENDING") return;
    const res = await fetch(`https://api.vatusa.net/v2/facility/${VATUSA_FACILITY}/roster/manageVisitor/${user.cid}?apiKey=${VATUSA_API_KEY}`, {
        method: 'POST',
    });
    const json = await res.json();
    console.log(json);
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
    await log("UPDATE", "VISITOR_APPLICATION", `Rejected visitor application for ${user.fullName} (${user.cid})`);
    revalidatePath('/admin/visitor-applications');
    revalidatePath(`/admin/visitor-applications/${application.id}`);
    revalidatePath('/visitor/new');
}