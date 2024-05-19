'use server';
import {Event} from "@prisma/client";
import {revalidatePath} from "next/cache";
import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {z} from "zod";
import {UTApi} from "uploadthing/server";

const MAX_FILE_SIZE = 1024 * 1024 * 4;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ut = new UTApi();

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

export const createOrUpdateEvent = async (formData: FormData, id: string) => {

    const Event = z.object({
        name: z.string(),
        host: z.string().optional(),
        description: z.string(),
        start: z.date(),
        end: z.date(),
        featuredFields: z.array(z.string()),
        bannerImage: z
            .any()
            .optional()
            .refine((file) => {
                return !file || file.size <= MAX_FILE_SIZE;
            }, 'File size must be less than 4MB')
            .refine((file) => {
                return ALLOWED_FILE_TYPES.includes(file?.type || '');
            }, 'File must be a PNG, JPEG, or GIF'),
    });

    const result = Event.parse({
        name: formData.get('name'),
        host: formData.get('host'),
        description: formData.get('description'),
        featuredFields: formData.get('featuredFields')?.toString().split(',').map((f) => f.trim()) || [],
        start: new Date(formData.get('start') as unknown as string),
        end: new Date(formData.get('end') as unknown as string),
        bannerImage: formData.get('bannerImage') as File,
    });

    const eventExists = !!(await prisma.event.findUnique({
            where: {
                id,
            }
    }));

    if (!eventExists && !result.bannerImage) {
        throw new Error("Banner image is required for new events");
    }

    const res = await ut.uploadFiles(result.bannerImage);

    if (!res.data) {
        throw new Error("Failed to upload banner image");
    }

    const data = await prisma.event.upsert({
        create: {
            name: result.name,
            host: result.host,
            description: result.description,
            start: result.start,
            end: result.end,
            external: !!result.host,
            featuredFields: result.featuredFields,
            bannerKey: res.data.key,
        },
        update: {
            name: result.name,
            host: result.host,
            description: result.description,
            start: result.start,
            end: result.end,
            external: !!result.host,
            featuredFields: result.featuredFields,
            bannerKey: res.data.key,
        },
        where: {
            id,
        }
    });

    if (eventExists) {
        await log('UPDATE', 'EVENT', `Updated event ${data.name}`);
    } else {
        await log('CREATE', 'EVENT', `Created event ${data.name}`);
    }

    revalidatePath('/admin/events');
    revalidatePath(`/events`);
    revalidatePath(`/events/${data.id}`);

    return data;
}