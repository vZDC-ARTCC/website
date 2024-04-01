'use server';

import {VisitorApplication} from "@prisma/client";
import prisma from "@/lib/db";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {log} from "@/actions/log";

const VATUSA_FACILITY = process.env.VATUSA_FACILITY || 'ZDC';
const VATUSA_API_KEY = process.env.VATUSA_API_KEY || '';
const DEV_MODE = process.env.DEV_MODE || '';

export const addVisitingApplication = async (data: VisitorApplication) => {

    const visitorZ = z.object({
        firstName: z.string().trim().min(1, "First name is required"),
        lastName: z.string().trim().min(1, "Last name is required"),
        cid: z.string().trim().min(1, "VATSIM CID is required"),
        rating: z.string().trim().min(1, "Rating is required"),
        email: z.string().trim().min(1, "Email is required"),
        homeFacility: z.string().trim().min(1, "Home ARTCC is required"),
        whyVisit: z.string().trim().min(1, "Reason for visiting is required"),
    });

    const result = visitorZ.parse(data);

    const existing = await prisma.visitorApplication.findFirst({
        where: {
            cid: result.cid,
            status: "PENDING",
        },
    });
    if (existing) {
        throw new Error("You already have a pending visitor application. Please wait for a decision before submitting another.");
    }

    await prisma.visitorApplication.create({
        data: {
            ...result,
            status: "PENDING",
            submittedAt: new Date(),
        },
    });
    revalidatePath('/admin/visitor-applications');
}

export const addVisitor = async (application: VisitorApplication) => {
    if (application.status !== "PENDING") return;
    if (!DEV_MODE) {
        await fetch(`https://api.vatusa.net/v2/facility/${VATUSA_FACILITY}/roster/manageVisitor/${application.cid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                apiKey: VATUSA_API_KEY,
            }),
        });
    }
    await prisma.visitorApplication.update({
        where: {
            id: application.id,
        },
        data: {
            status: "APPROVED",
            decidedAt: new Date(),
        },
    });
    await log("UPDATE", "VISITOR_APPLICATION", `Approved visitor application for ${application.firstName} ${application.lastName} (${application.cid})`);
    revalidatePath('/controllers/roster');
    revalidatePath('/admin/visitor-applications');
    revalidatePath(`/admin/visitor-applications/${application.id}`);
}

export const rejectVisitor = async (application: VisitorApplication) => {
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
    });
    await log("UPDATE", "VISITOR_APPLICATION", `Rejected visitor application for ${application.firstName} ${application.lastName} (${application.cid})`);
    revalidatePath('/admin/visitor-applications');
    revalidatePath(`/admin/visitor-applications/${application.id}`);
}