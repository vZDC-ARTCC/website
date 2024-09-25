'use server';

import {FROM_EMAIL, mailTransport} from "@/lib/email";
import {User} from "next-auth";
import {incidentClosed} from "@/templates/Incident/IncidentClosed";

export const sendIncidentReportClosedEmail = async (reporter: User, reportee: User) => {

    const {html} = await incidentClosed(reporter, reportee);

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: reporter.email,
        subject: `Incident Report Closed`,
        html,
    });

}