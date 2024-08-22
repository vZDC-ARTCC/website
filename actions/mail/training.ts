'use server';

import {Lesson, TrainerReleaseRequest, TrainingAssignmentRequest, TrainingSession} from "@prisma/client";
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

export const sendTrainingAssignmentUpdatedEmail = async (student: User, primaryTrainer: User, otherTrainers: User[]) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: `${student.email}, ${primaryTrainer.email}, ${otherTrainers.map(trainer => trainer.email).join(', ')}`,
        subject: "Training Assignment Updated",
        text: `
        Hello ${student.firstName} ${student.lastName},\n\n
        Your training assignment has been updated. Please check your profile for more details.\n\n
        ${emailFooter(student)}
        `,
    });

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: primaryTrainer.email,
        subject: "Training Assignment Updated - Primary Trainer",
        text: `
        Hello ${primaryTrainer.firstName} ${primaryTrainer.lastName},\n\n
        The training assignment for ${student.firstName} ${student.lastName} has been updated.\n
        You have been assigned as the primary trainer for ${student.firstName} ${student.lastName}. Please check the "Your Students" section of the dashboard for more details.\n\n
        ${emailFooter(primaryTrainer)}
        `,
    });

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: otherTrainers.map(trainer => trainer.email).join(', '),
        subject: "Training Assignment Updated",
        text: `
        Hello Trainers,\n\n
        The training assignment for ${student.firstName} ${student.lastName} has been updated. Please check the "Your Students" section of the dashboard for more details as you may have been removed from this assignment.\n\n
        ${emailFooter(otherTrainers[0])}
        `,
    });
};

export const sendTrainingAssignmentDeletedEmail = async (student: User, trainers: User[]) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: student.email,
        subject: "Training Assignment Deleted",
        text: `
        Hello ${student.firstName} ${student.lastName},\n\n
        Your training assignment has been deleted. Please check your profile for more details.\n\n
        ${emailFooter(student)}
        `,
    });

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: trainers.map(trainer => trainer.email).join(', '),
        subject: "Training Assignment Deleted",
        text: `
        Hello Trainers,\n\n
        The training assignment for ${student.firstName} ${student.lastName} has been deleted. You are no longer obligated to train this student. Please check the "Your Students" section of the dashboard for more details.\n\n
        ${emailFooter(trainers[0])}
        `,
    });
};

export const sendReleaseRequestApprovedEmail = async (student: User, trainers: User[]) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: student.email,
        subject: "Release Request Approved",
        text: `
        Hello ${student.firstName} ${student.lastName},\n\n
        Your release request has been approved. Please check your profile for more details.\n\n
        ${emailFooter(student)}
        `,
    });

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: trainers.map(trainer => trainer.email).join(', '),
        subject: "Release Request Approved",
        text: `
        Hello Trainers,\n\n
        The release request for ${student.firstName} ${student.lastName} has been approved. You are no longer obligated to train this student. Please check the "Your Students" section of the dashboard for more details.\n\n
        ${emailFooter(trainers[0])}
        `,
    });
};

export const sendTrainingRequestFulfilledEmail = async (student: User, primaryTrainer: User, otherTrainers: User[]) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: `${student.email}, ${primaryTrainer.email}, ${otherTrainers.map(trainer => trainer.email).join(', ')}`,
        subject: "Training Request Fulfilled",
        text: `
        Hello ${student.firstName} ${student.lastName},\n\n
        Your training request has been fulfilled with the following mentors:\n\n ${primaryTrainer.firstName} ${primaryTrainer.lastName} (Primary Trainer)\n${otherTrainers.map(trainer => `${trainer.firstName} ${trainer.lastName}`).join('\n')}.\n\n
        Check your profile for more details.
        ${emailFooter(student)}
        `,
    });

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: primaryTrainer.email,
        subject: "Training Request Fulfilled - Primary Trainer",
        text: `
        Hello ${primaryTrainer.firstName} ${primaryTrainer.lastName},\n\n
        You have been assigned as the primary trainer for ${student.firstName} ${student.lastName}. Please check the "Your Students" section of the dashboard for more details.\n\n
        ${emailFooter(primaryTrainer)}
        `,
    });

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: otherTrainers.map(trainer => trainer.email).join(', '),
        subject: "Training Request Fulfilled",
        text: `
        Hello Trainers,\n\n
        The training request for ${student.firstName} ${student.lastName} has been fulfilled. You are now assigned to train this student as a backup trainer. Please check the "Your Students" section of the dashboard for more details.\n\n
        ${emailFooter(otherTrainers[0])}
        `,
    });
};

export const sendTrainingRequestDeletedEmail = async (student: User) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: student.email,
        subject: "Training Request Deleted",
        text: `
        Hello ${student.firstName} ${student.lastName},\n\n
        Your training request has been deleted. Please check your profile for more details.\n\n
        ${emailFooter(student)}
        `,
    });
};