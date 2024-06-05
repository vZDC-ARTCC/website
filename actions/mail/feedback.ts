'use server';
import {User} from "next-auth";
import {mailTransport} from "@/lib/email";
import {Feedback} from "@prisma/client";
import emailFooter from "@/actions/mail/footer";

export const sendNewFeedbackEmail = async (controller: User, feedback: Feedback) => {
    await mailTransport.sendMail({
        from: process.env.EMAIL_FROM,
        to: controller.email,
        subject: "New Feedback",
        text: `
        Hello ${controller.firstName} ${controller.lastName},\n\n
        
        You have received new feedback. Click the link below to view it:\n\n
        
        ${process.env.NEXTAUTH_URL}/profile/feedback/${feedback.id}
        ${emailFooter(controller)}
        `
    });
}