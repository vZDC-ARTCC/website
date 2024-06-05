'use server';

import {User} from "next-auth";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import emailFooter from "@/actions/mail/footer";

const VATUSA_FACILITY = process.env.VATUSA_FACILITY;

export const sendVisitorApplicationCreatedEmail = async (user: User) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Visitor Application Submitted",
        text: `
        Hello ${user.firstName} ${user.lastName},\n\n
        Your visitor application has been submitted. A staff member will review your application and get back to you shortly.
        ${emailFooter(user)}
        `,
    })
}

export const sendVisitorApplicationAcceptedEmail = async (user: User) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Visitor Application Accepted",
        text: `
        Hello ${user.firstName} ${user.lastName},\n\n
        Congratulations! Your visitor application has been accepted. You are now a visitor at ${VATUSA_FACILITY}.\n\n
        Before you can control at any of our facilities, read our administrative documents and our visitor policy.\n
        You can now access our website to customize your profile and request training.
        ${emailFooter(user)}
        `,
    });
}

export const sendVisitorApplicationRejectedEmail = async (user: User) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Visitor Application Rejected",
        text: `
        Hello ${user.firstName} ${user.lastName},\n\n
        We regret to inform you that your visitor application has been rejected. If you have any questions, please contact us.
        ${emailFooter(user)}
        `,
    });
}