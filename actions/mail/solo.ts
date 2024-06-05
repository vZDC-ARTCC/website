'use server';

import {User} from "next-auth";
import {SoloCertification} from "@prisma/client";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import {formatZuluDate} from "@/lib/date";
import emailFooter from "@/actions/mail/footer";

export const sendSoloAddedEmail = async (controller: User, solo: SoloCertification) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: 'Solo Certification Added',
        text: `
        Hello ${controller.firstName} ${controller.lastName},\n\n
        
        A solo certification has been added for you.\n
        You are now able to control ${solo.position}.\n\n
        Expires: ${formatZuluDate(solo.expires)}
        ${emailFooter(controller)}
        `,
    })
}

export const sendSoloDeletedEmail = async (controller: User, solo: SoloCertification) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: 'Solo Certification Removed',
        text: `
        Hello ${controller.firstName} ${controller.lastName},\n\n
        
        Your solo certification for ${solo.position} has been removed.\n\n
        ${emailFooter(controller)}
        `,
    });
}

export const sendSoloExpiredEmail = async (controller: User, solo: SoloCertification) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: 'Solo Certification Expired',
        text: `
        Hello ${controller.firstName} ${controller.lastName},\n\n
        
        Your solo certification for ${solo.position} has expired.\n
        Do not control this position until you have been re-certified.\n\n
        ${emailFooter(controller)}
        `,
    });
}