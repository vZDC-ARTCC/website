'use server';

import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {Event, EventPosition} from "@prisma/client";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {User} from "next-auth";
import {sendEventPositionEmail, sendEventPositionRemovalEmail} from "@/actions/mail/event";

export const deleteEventPosition = async (id: string) => {
    const data = await prisma.eventPosition.delete({
        where: {
            id,
        },
        include: {
            event: true,
            controllers: true,
        },
    });
    await log('DELETE', 'EVENT_POSITION', `Deleted event position ${data.position} for ${data.event.name}`);

    for (const controller of data.controllers) {
        await sendEventPositionRemovalEmail(controller as User, data, data.event);
    }

    revalidatePath(`/admin/events/edit/${data.event.id}/positions`);
    revalidatePath(`/admin/events`);
    return data;
}

export const createOrUpdateEventPosition = async (event: Event, eventPosition: EventPosition) => {
    const EventPosition = z.object({
        position: z.string().min(1, "Position Name is required.").max(40, 'Position name must be less than 40 characters'),
        signupCap: z.number().optional(),
        minRating: z.number().min(-1, "Rating is invalid").max(10, "Rating is invalid"),
    });

    const result = EventPosition.parse(eventPosition);

    const eventPositionExists = await prisma.eventPosition.findUnique({
        where: {
            id: eventPosition.id,
        },
    });

    const data = await prisma.eventPosition.upsert({
        where: {
            id: eventPosition.id,
        },
        update: result,
        create: {
            ...result,
            event: {
                connect: {
                    id: event.id,
                },
            },
        },
    });

    if (eventPositionExists) {
        await log('UPDATE', 'EVENT_POSITION', `Updated event position ${data.position} for ${event.name}`);
    } else {
        await log('CREATE', 'EVENT_POSITION', `Created event position ${data.position} for ${event.name}`);
    }

    revalidatePath(`/admin/events/edit/${event.id}/positions`);
    revalidatePath(`/admin/events`);
    return data;
}

export const assignEventPosition = async (event: Event, eventPosition: EventPosition,  controllers: User[], user: User) => {
    if (!isAbleToSignup(eventPosition, controllers, user)) {
        throw new Error("User is not able to signup for this position");
    }
    const signedUpPositions = await prisma.eventPosition.findMany({
        where: {
            controllers: {
                some: {
                    id: user.id,
                },
            },
            id: {
                not: eventPosition.id,
            },
        },
    });
    if (signedUpPositions.length > 0) {
        throw new Error("User is already signed up for another position");
    }
    if (event.positionsLocked) {
        throw new Error("Event positions are locked");
    }
    if (eventPosition.signupCap && controllers.length >= eventPosition.signupCap) {
        throw new Error("Position is full");
    }
    const data = await prisma.eventPosition.update({
        where: {
            id: eventPosition.id,
        },
        data: {
            controllers: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    await sendEventPositionEmail(user, eventPosition, event);

    revalidatePath(`/admin/events/edit/${eventPosition.eventId}/positions`);
    revalidatePath(`/events/${eventPosition.eventId}`);
    return data;
}

export const unassignEventPosition = async (event: Event, eventPosition: EventPosition, user: User, force?: boolean) => {

    if (event.positionsLocked && !force) {
        throw new Error("Event positions are locked");
    }

    const data = await prisma.eventPosition.update({
        where: {
            id: eventPosition.id,
        },
        data: {
            controllers: {
                disconnect: {
                    id: user.id,
                },
            },
        },
    });

    await sendEventPositionRemovalEmail(user, eventPosition, event);

    revalidatePath(`/admin/events/edit/${event.id}/positions`);
    revalidatePath(`/events/${event.id}`);
    return data;
}

export const forceAssignPosition = async (eventPositionId: string, userId: string) => {
    const eventPosition = await prisma.eventPosition.update({
        where: {
            id: eventPositionId,
        },
        data: {
            controllers: {
                connect: {
                    id: userId,
                },
            },
        },
        include: {
            event: true,
        }
    });
    const controller = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        }
    });

    await sendEventPositionEmail(controller as User, eventPosition, eventPosition.event);
    await log('UPDATE', 'EVENT_POSITION', `Forced assigned ${eventPosition.position} to ${controller.firstName} ${controller.lastName} (${controller.cid}) in ${eventPosition.event.name}`);
    revalidatePath(`/admin/events/edit/${eventPosition.eventId}/positions`);
    revalidatePath(`/events/${eventPosition.eventId}`);
    return { eventPosition, controller };
}

const isAbleToSignup = (eventPosition: EventPosition, controllersSignedUp: User[], controller: User) => {
    if (controller.controllerStatus === "NONE") {
        return false;
    }
    if (eventPosition.signupCap && controllersSignedUp.length >= eventPosition.signupCap) {
        return false;
    }
    return !(eventPosition.minRating && eventPosition.minRating > controller.rating);

}