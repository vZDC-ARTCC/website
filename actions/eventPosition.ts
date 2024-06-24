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

export const createOrUpdateEventPosition = async (formData: FormData) => {
    const eventPositionZ = z.object({
        eventId: z.string(),
        id: z.string().optional(),
        position: z.string().min(1, "Position Name is required.").max(40, 'Position name must be less than 40 characters'),
        signupCap: z.number().optional(),
        minRating: z.number().min(-1, "Rating is invalid").max(10, "Rating is invalid"),
    });

    const result = eventPositionZ.safeParse({
        eventId: formData.get('eventId') as string,
        id: formData.get('id') as string,
        position: formData.get('position'),
        signupCap: Number(formData.get('signupCap') as string),
        minRating: Number(formData.get('minRating') as string),
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const eventPositionExists = await prisma.eventPosition.findUnique({
        where: {
            id: result.data.id,
        },
    });

    const eventPosition = await prisma.eventPosition.upsert({
        where: {
            id: result.data.id,
        },
        update: {
            position: result.data.position,
            signupCap: result.data.signupCap,
            minRating: result.data.minRating,
        },
        create: {
            position: result.data.position,
            signupCap: result.data.signupCap,
            minRating: result.data.minRating,
            event: {
                connect: {
                    id: result.data.eventId,
                },
            },
        },
        include: {
            event: true,
        },
    });

    if (eventPositionExists) {
        await log('UPDATE', 'EVENT_POSITION', `Updated event position ${eventPosition.position} for ${eventPosition.event.name}`);
    } else {
        await log('CREATE', 'EVENT_POSITION', `Created event position ${eventPosition.position} for ${eventPosition.event.name}`);
    }

    revalidatePath(`/admin/events/edit/${eventPosition.eventId}/positions`);
    revalidatePath(`/admin/events`);
    return {eventPosition};
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
    // if (signedUpPositions.length > 0) {
    //     throw new Error("User is already signed up for another position");
    // }
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

export const forceAssignPosition = async (formData: FormData) => {

    const assignZ = z.object({
        position: z.string(),
        controller: z.string(),
    });

    const result = assignZ.safeParse({
        position: formData.get('position') as string,
        controller: formData.get('controller') as string,
    });

    if (!result.success) {
        return {errors: [{message: 'Invalid form data'}]};
    }

    const eventPosition = await prisma.eventPosition.update({
        where: {
            id: result.data.position,
        },
        data: {
            controllers: {
                connect: {
                    id: result.data.controller,
                },
            },
        },
        include: {
            event: true,
        }
    });

    const controller = await prisma.user.findUniqueOrThrow({
        where: {
            id: result.data.controller,
        }
    });

    await sendEventPositionEmail(controller as User, eventPosition, eventPosition.event);
    await log('UPDATE', 'EVENT_POSITION', `Forced assigned ${eventPosition.position} to ${controller.firstName} ${controller.lastName} (${controller.cid}) in ${eventPosition.event.name}`);
    revalidatePath(`/admin/events/edit/${eventPosition.eventId}/positions`);
    revalidatePath(`/events/${eventPosition.eventId}`);
    return { eventPosition, controller };
}

const isAbleToSignup = (eventPosition: EventPosition, controllersSignedUp: User[], controller: User) => {
    if (controller.noEventSignup) {
        return false;
    }
    if (controller.controllerStatus === "NONE") {
        return false;
    }
    if (eventPosition.signupCap && controllersSignedUp.length >= eventPosition.signupCap) {
        return false;
    }
    return !(eventPosition.minRating && eventPosition.minRating > controller.rating);

}