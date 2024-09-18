'use server';
import {User} from "next-auth";
import {Event, EventPosition} from "@prisma/client";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import {formatZuluDate} from "@/lib/date";
import {eventPositionAssigned} from "@/templates/EventPosition/EventPositionAssigned";
import {eventPositionRemoved} from "@/templates/EventPosition/EventPositionRemoved";

export const sendEventPositionEmail = async (controller: User, eventPosition: EventPosition, event: Event) => {

    function splitTimeDate(input: string) {
        const dateSplit = input.split(" ")
        const icalDate = '20'+dateSplit[0].split("/").at(-1)+dateSplit[0].split("/").join("").substr(0,4)
        const icalTime = dateSplit[1].replace('z','00')
        return icalDate + "T" + icalTime + "Z"
    }

    const icalContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//vZDC.org//vZDC Events\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nBEGIN:VEVENT\r\nSUMMARY:${event.name}\r\nUID:c7614cff-3549-4a00-9152-d25cc1fe077\r\nSTATUS:CONFIRMED\r\nDTSTART:${splitTimeDate(formatZuluDate(event.start))}\r\nDTEND:${splitTimeDate(formatZuluDate(event.end))}\r\nDTSTAMP:${splitTimeDate(formatZuluDate(new Date()))}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`

    const {html} = await eventPositionAssigned(controller, eventPosition, event);

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: `Event Position Assignment: ${event.name}`,
        html,
        attachments: [{
            filename: "event.ics",
            content: icalContent
        }],
    });

}

export const sendEventPositionRemovalEmail = async (controller: User, eventPosition: EventPosition, event: Event) => {

    const {html} = await eventPositionRemoved(controller, eventPosition, event);

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: `Event Position Removal: ${event.name}`,
        html,
    });
}