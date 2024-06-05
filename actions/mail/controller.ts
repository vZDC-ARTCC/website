'use server';

import {User} from "next-auth";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import emailFooter from "@/actions/mail/footer";

const VATUSA_FACILITY = process.env.VATUSA_FACILITY;

export const sendRosterRemovalEmail = async (controller: User) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: "Roster Status Update",
        text: `
        Hello ${controller.firstName} ${controller.lastName},\n\n
        
        You have been removed from the ${VATUSA_FACILITY} roster.\n\n
        
        If you have any questions or feel this is an error, please contact the ${VATUSA_FACILITY} staff IMMEDIATELY.
        ${emailFooter(controller)}
        `,
    });
}