'use server';

import {User} from "next-auth";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import {rosterStatusChange} from "@/templates/Controller/RosterStatusChange";

export const sendRosterRemovalEmail = async (controller: User) => {

    const {html} = await rosterStatusChange(controller, "Inactivity");

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: "Roster Status Update",
        html,
    });
}