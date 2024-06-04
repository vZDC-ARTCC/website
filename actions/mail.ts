'use server';

// TODO Add email logic with some library
import {mailTransport} from "@/lib/email";

export const sendTestEmail = async (email: string) => {
    return mailTransport.sendMail({
        from: "beabravedude@gmail.com",
        to: email,
        subject: "Testing my Nodemailer/SES setup",
        text: "This is a message to say you did it!",
    });
}