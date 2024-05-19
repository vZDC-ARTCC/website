'use server';

import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {Event, EventPosition} from "@prisma/client";
import {z} from "zod";
import {revalidatePath} from "next/cache";

export const deleteEventPosition = async (id: string) => {
    const data = await prisma.eventPosition.delete({
        where: {
            id,
        },
        include: {
            event: true,
        },
    });
    await log('DELETE', 'EVENT_POSITION', `Deleted event position ${data.position} for ${data.event.name}`);

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