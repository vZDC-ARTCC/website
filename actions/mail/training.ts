'use server';

import {Lesson, TrainingSession} from "@prisma/client";
import {User} from "next-auth";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import emailFooter from "@/actions/mail/footer";
import prisma from "@/lib/db";

export const sendTrainingSessionCreatedEmail = async (student: User, trainer: User, trainingSession: TrainingSession) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: student.email,
        subject: "New Training Session",
        text: `
        Hello ${student.firstName} ${student.lastName},\n\n
        You have new training notes submitted by ${trainer.firstName} ${trainer.lastName} for a training session with ${trainer.firstName} ${trainer.lastName}.\n
        Click the link below to view the training session:\n
        ${process.env.NEXTAUTH_URL}/profile/training/${trainingSession.id}
        ${emailFooter(student)}
        `,
    })
}

export const sendInstructorsTrainingSessionCreatedEmail = async (student: User, trainer: User, trainingSession: TrainingSession, lesson: Lesson) => {

    const instructorEmails = await prisma.user.findMany({
        where: {
            roles: {
                has: "INSTRUCTOR",
            },
        },
        select: {
            email: true,
        },
    });

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: instructorEmails.join(','),
        subject: "Training Session Passed",
        text: `
        Hello Instructors,
        
        ${student.firstName} ${student.lastName} has passed a training session with ${trainer.firstName} ${trainer.lastName} for lesson ${lesson.name}.\n\n
        Click the link below to view the training session:\n
        ${process.env.NEXTAUTH_URL}/training/sessions/${trainingSession.id}\n\n
        You are receiving this email because you are an instructor and this lesson has been configured to send an email on pass.\n\n
        `,
    })
}