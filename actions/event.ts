'use server';
import {Event, EventType} from "@prisma/client";
import {revalidatePath} from "next/cache";
import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {z} from "zod";
import {UTApi} from "uploadthing/server";

const MAX_FILE_SIZE = 1024 * 1024 * 4;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ut = new UTApi();

export const lockUpcomingEvents = async () => {
    const in48Hours = new Date();
    in48Hours.setHours(in48Hours.getHours() + 48);

    await prisma.event.updateMany({
        where: {
            start: {
                lte: in48Hours,
            },
            positionsLocked: false,
        },
        data: {
            positionsLocked: true,
        },
    });

}

export const deleteStaleEvents = async () => {

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const eventsToDelete = await prisma.event.findMany({
        where: {
            end: {
                lte: oneWeekAgo,
            },
        },
    });

    for (const event of eventsToDelete) {
        await deleteEvent(event.id);
        await ut.deleteFiles(eventsToDelete.map((e) => e.bannerKey));
    }

}


export const deleteEvent = async (id: string) => {
    revalidatePath('/admin/events');
    const data = await prisma.event.delete({
        where: {
            id,
        },
    });
    await log('DELETE', 'EVENT', `Deleted event ${data.name}`);
    const res = await ut.deleteFiles(data.bannerKey);
    if (!res.success) {
        throw new Error("Failed to delete banner image");
    }
    return data;
}

export const createOrUpdateEvent = async (formData: FormData) => {

    const eventZ = z.object({
        id: z.string().optional(),
        name: z.string(),
        host: z.string().optional(),
        type: z.string().min(1, "Type is required"),
        description: z.string(),
        start: z.date(),
        end: z.date(),
        featuredFields: z.array(z.string()),
        bannerImage: z
            .any()
            .optional()
            .refine((file) => {
                return formData.get('id') || !file || file.size <= MAX_FILE_SIZE;
            }, 'File size must be less than 4MB')
            .refine((file) => {
                return formData.get('id') || ALLOWED_FILE_TYPES.includes(file?.type || '');
            }, 'File must be a PNG, JPEG, or GIF'),
    });

    const result = eventZ.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        host: formData.get('host'),
        type: formData.get('type'),
        description: formData.get('description'),
        featuredFields: formData.get('featuredFields')?.toString().split(',').map((f) => f.trim()) || [],
        start: new Date(formData.get('start') as unknown as string),
        end: new Date(formData.get('end') as unknown as string),
        bannerImage: formData.get('bannerImage') as File,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    if (result.data.start.getTime() >= result.data.end.getTime()) {
        return {errors: [{message: "eventZ start time must be before the end time",}]};
    }

    const eventExists = await prisma.event.findUnique({
            where: {
                id: result.data.id,
            },
    });

    if (!eventExists && !result.data.bannerImage) {
        return {errors: [{message: "Banner image is required",}]};
    }

    let bannerKey = eventExists?.bannerKey || '';
    if (!eventExists) {
        const res = await ut.uploadFiles(result.data.bannerImage);
        if (!res.data) {
            throw new Error("Failed to upload banner image");
        }
        bannerKey = res.data?.key;
    } else if ((result.data.bannerImage as File).size > 0) {
        const deletion = await ut.deleteFiles(eventExists.bannerKey);
        if (!deletion.success) {
            throw new Error("Failed to delete old banner image");
        }
        const res = await ut.uploadFiles(result.data.bannerImage);
        if (!res.data) {
            throw new Error("Failed to upload banner image");
        }
        bannerKey = res.data.key;
    }

    const event = await prisma.event.upsert({
        create: {
            name: result.data.name,
            host: result.data.host,
            type: result.data.type as EventType,
            description: result.data.description,
            start: result.data.start,
            end: result.data.end,
            external: !!result.data.host,
            featuredFields: result.data.featuredFields,
            positionsLocked: false,
            bannerKey,
        },
        update: {
            name: result.data.name,
            host: result.data.host,
            type: result.data.type as EventType,
            description: result.data.description,
            start: result.data.start,
            end: result.data.end,
            external: !!result.data.host,
            featuredFields: result.data.featuredFields,
            bannerKey,
        },
        where: {
            id: result.data.id,
        }
    });

    if (result.data.id) {
        await log('UPDATE', 'EVENT', `Updated event ${event.name}`);
    } else {
        await log('CREATE', 'EVENT', `Created event ${event.name}`);
    }

    revalidatePath('/admin/events');
    revalidatePath(`/events`);
    revalidatePath(`/events/${event.id}`);

    return {event};
}

export const setPositionsLock = async (event: Event, lock: boolean) => {
    const data = await prisma.event.update({
        where: {
            id: event.id,
        },
        data: {
            positionsLocked: lock,
        },
    });

    await log('UPDATE', 'EVENT', `Set positions lock for event ${data.name} to ${lock}`);

    revalidatePath(`/admin/events/${event.id}/positions`);
    revalidatePath(`/admin/events/${event.id}`);
    revalidatePath(`/admin/events`);
    return data;
}