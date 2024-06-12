'use server';

import {z} from "zod";
import {Feedback} from "@prisma/client";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {log} from "@/actions/log";
import {sendNewFeedbackEmail} from "@/actions/mail/feedback";
import {User} from "next-auth";

export const submitFeedback = async (formData: FormData) => {

    const feedbackZ = z.object({
        pilotId: z.string().min(1),
        pilotCallsign: z.string().trim().min(1),
        controllerId: z.string().trim().min(1),
        controllerPosition: z.string().min(1),
        rating: z.number(),
        comments: z.string().trim(),
    });

    const result = feedbackZ.safeParse({
        pilotId: formData.get('pilotId') as string,
        pilotCallsign: formData.get('pilotCallsign') as string,
        controllerId: formData.get('controllerId') as string,
        controllerPosition: formData.get('controllerPosition') as string,
        rating: parseInt(formData.get('rating') as string),
        comments: formData.get('comments') as string,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    if (result.data.pilotId === result.data.controllerId) {
        return {errors: [{message: "You cannot submit feedback for yourself."}]};
    }

    const feedback = await prisma.feedback.create({
        data: {
            pilot: {
                connect: {
                    id: result.data.pilotId,
                },
            },
            pilotCallsign: result.data.pilotCallsign,
            controller: {
                connect: {
                    id: result.data.controllerId,
                },
            },
            controllerPosition: result.data.controllerPosition,
            rating: result.data.rating,
            comments: result.data.comments,
            submittedAt: new Date(),
            status: "PENDING",
        },
    });
    revalidatePath('/admin/feedback');
    return {feedback};
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