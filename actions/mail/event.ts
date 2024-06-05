'use server';
import {User} from "next-auth";
import {Event, EventPosition} from "@prisma/client";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import {formatZuluDate} from "@/lib/date";
import emailFooter from "@/actions/mail/footer";

export const sendEventPositionEmail = async (controller: User, eventPosition: EventPosition, event: Event) => {
    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
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