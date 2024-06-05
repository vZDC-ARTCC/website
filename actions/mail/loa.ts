'use server';

import {User} from "next-auth";
import {LOA} from "@prisma/client";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import emailFooter from "@/actions/mail/footer";

export const sendLoaApprovedEmail = async (controller: User, loa: LOA) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: "LOA Request Approved",
        text: `
    Hello ${controller.firstName} ${controller.lastName},\n\n
    Your LOA request has been approved!\n\n
    Your LOA will go into effect on ${loa.start.toDateString()} and end on ${loa.end.toDateString()}.\n\n
    You can delete your LOA at any time on your profile page.\n
    If you modify your LOA, it will need to be approved.\n
    If you control while on LOA, your LOA will be cancelled.
    ${emailFooter(controller)}
        `,
    });
}

export const sendLoaDeniedEmail = async (controller: User) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: "LOA Request Denied",
        text: `
    Hello ${controller.firstName} ${controller.lastName},\n\n
    Your LOA request has been denied.\n
    Contact staff if you have any questions.
    ${emailFooter(controller)}
        `,
    });
}

export const sendLoaDeletedEmail = async (controller: User) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: "LOA Request Deleted",
        text: `
    Hello ${controller.firstName} ${controller.lastName},\n\n
    Your LOA request has been deleted.\n
    Contact staff if you have any questions.
    ${emailFooter(controller)}
        `,
    });
}

export const sendLoaRequestedEmail = async (controller: User) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: "LOA Requested",
        text: `
    Hello ${controller.firstName} ${controller.lastName},\n\n
    Your LOA request has been submitted.\n
    You will be notified when your LOA has been approved or denied.\n
    You can delete your LOA at any time on your profile page.\n
    If you modify your LOA, it will need to be approved again.\n
    If you control while on LOA, your LOA will be cancelled.
    ${emailFooter(controller)}
        `,
    });
}

export const sendLoaExpiredEmail = async (controller: User) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: "LOA Expired",
        text: `
    Hello ${controller.firstName} ${controller.lastName},\n\n
    Your LOA has expired.\n
    If you need to go on LOA again, you can submit a new request on your profile page.\n
    If you control while on LOA, your LOA will be cancelled.
    ${emailFooter(controller)}
        `,
    });
}