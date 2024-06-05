'use server';

import {z} from "zod";
import {Feedback} from "@prisma/client";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {log} from "@/actions/log";
import {sendNewFeedbackEmail} from "@/actions/mail/feedback";
import {User} from "next-auth";

export const submitFeedback = async (data: Feedback) => {

    const feedbackZ = z.object({
        pilotId: z.string().min(1),
        pilotCallsign: z.string().trim().min(1),
        controllerId: z.string().trim().min(1),
        controllerPosition: z.string().min(1),
        rating: z.number(),
        comments: z.string().trim(),
    });

    feedbackZ.parse(data);

    await prisma.feedback.create({
        data: {
            pilot: {
                connect: {
                    id: data.pilotId,
                },
            },
            pilotCallsign: data.pilotCallsign,
            controller: {
                connect: {
                    id: data.controllerId,
                },
            },
            controllerPosition: data.controllerPosition,
            rating: data.rating,
            comments: data.comments,
            submittedAt: new Date(),
            status: "PENDING",
        },
    });
    revalidatePath('/admin/feedback');
}

export const releaseFeedback = async (feedback: Feedback) => {
    const releasedFeedback = await prisma.feedback.update({
        where: {
            id: feedback.id,
        },
        data: {
            status: "RELEASED",
            staffComments: feedback.staffComments,
            decidedAt: new Date(),
        },
        include: {
            controller: true,
        },
    });

    await sendNewFeedbackEmail(releasedFeedback.controller as User, releasedFeedback);

    await log("UPDATE", "FEEDBACK", `Released feedback for ${releasedFeedback.controller.firstName} ${releasedFeedback.controller.lastName} (${releasedFeedback.controller.cid})`);
    revalidatePath('/admin/feedback');
    revalidatePath(`/admin/feedback/${feedback.id}`);
}

export const stashFeedback = async (feedback: Feedback) => {
    const stashedFeedback = await prisma.feedback.update({
        where: {
            id: feedback.id,
        },
        data: {
            status: "STASHED",
            decidedAt: new Date(),
        },
        include: {
            controller: true,
        },
    });
    await log("UPDATE", "FEEDBACK", `Stashed feedback for ${stashedFeedback.controller.firstName} ${stashedFeedback.controller.lastName} (${stashedFeedback.controller.cid})`);
    revalidatePath('/admin/feedback');
    revalidatePath(`/admin/feedback/${feedback.id}`);
}