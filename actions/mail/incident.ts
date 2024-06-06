'use server';

import {FROM_EMAIL, mailTransport} from "@/lib/email";
import {User} from "next-auth";
import emailFooter from "@/actions/mail/footer";

export const sendIncidentReportClosedEmail = async (reporter: User, reportee: User) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: reporter.email,
        subject: `Incident Report Closed`,
        text: `
        Dear ${reporter.firstName} ${reporter.lastName},\n\n
        Your incident report against ${reportee.firstName} ${reportee.lastName} has been closed.
        ${emailFooter(reporter)}
        `
    });

}