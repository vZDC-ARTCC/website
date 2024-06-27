'use server';
import {User} from "next-auth";
import {Event, EventPosition} from "@prisma/client";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import {formatZuluDate} from "@/lib/date";
import emailFooter from "@/actions/mail/footer";

export const sendEventPositionEmail = async (controller: User, eventPosition: EventPosition, event: Event) => {

    function splitTimeDate(input) {
        const dateSplit = input.split(" ")
        const icalDate = '20'+dateSplit[0].split("/").at(-1)+dateSplit[0].split("/").join("").substr(0,4)
        const icalTime = dateSplit[1].replace('z','00')
        const icalDateTime = icalDate+icalTime
        return icalDateTime
    }

    const icalContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//vZDC.org//vZDC Events\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nBEGIN:VEVENT\r\nSUMMARY:${event.name}\r\nUID:c7614cff-3549-4a00-9152-d25cc1fe077\r\nSTATUS:CONFIRMED\r\nDTSTART:${splitTimeDate(formatZuluDate(event.start))}\r\nDTEND:${splitTimeDate(formatZuluDate(event.end))}\r\nDTSTAMP:${splitTimeDate(formatZuluDate(new Date()))}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`
    console.log(event)
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: 'harryxu2626@gmail.com',
        subject: `Event Position Assignment: ${event.name}`,
        text: `
        Hello ${controller.firstName} ${controller.lastName},\n\n
        
        You have been assigned a controlling position for an event:\n\n
        
        Event: ${event.name}
        Host: ${event.host}
        Date: ${formatZuluDate(event.start)}\n\n
        
        Position: ${eventPosition.position}
        ${emailFooter(controller)}
        `,
        attachments: {
            filename: "event.ics",
            content: icalContent
        },
    });
}

export const sendEventPositionRemovalEmail = async (controller: User, eventPosition: EventPosition, event: Event) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: `Event Position Removal: ${event.name}`,
        text: `
        Hello ${controller.firstName} ${controller.lastName},\n\n
        
        You have been removed from a controlling position for an event:\n\n
        
        Event: ${event.name}
        Host: ${event.host}
        Date: ${formatZuluDate(event.start)}\n\n
        
        Position: ${eventPosition.position}
        ${emailFooter(controller)}
        `,
    });
}