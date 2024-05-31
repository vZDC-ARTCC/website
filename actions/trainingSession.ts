'use client';

import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";


export async function deleteTrainingSession(id: string) {
    const trainingSession = await prisma.trainingSession.delete({
        where: {id},
        include: {
            student: true,
        }
    });

    await log("DELETE", "TRAINING_SESSION", `Deleted training session with student ${trainingSession.student.cid} - ${trainingSession.student.firstName} ${trainingSession.student.lastName}`);

    revalidatePath('/training/sessions', "layout");

    return trainingSession;
}