'use server';

import {UTApi} from "uploadthing/server";
import {z} from "zod";
import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";

const ut = new UTApi();

export const createOrUpdateFile = async (formData: FormData) => {
    const fileZ = z.object({
        categoryId: z.string(),
        id: z.string().optional(),
        name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
        description: z.string().max(255, 'Description is too long'),
    });

    const result = fileZ.safeParse({
        categoryId: formData.get('categoryId') as string,
        id: formData.get('id') as string,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const fileExists = await prisma.file.findUnique({
        where: {
            id: result.data.id || '',
        },
    });

    const inputFile = formData.get('file') as File | null;
    let fileKey = fileExists?.key || '';

    if (inputFile) {
        const res = await ut.uploadFiles(inputFile);
        if (res.error) {
            console.log(res.error);
            throw new Error("Error saving file");
        }
        fileKey = res.data.key;
        if (fileExists) {
            await ut.deleteFiles(fileExists.key);
        }
    } else if (!fileExists) {
        return {errors: [{message: "File is required for new entries"}]};
    }

    const file = await prisma.file.upsert({
        where: {id: result.data.id || ''},
        update: {
            name: result.data.name,
            description: result.data.description,
            key: fileKey,
            updatedAt: new Date(),
        },
        create: {
            name: result.data.name,
            description: result.data.description,
            key: fileKey,
            category: {
                connect: {
                    id: result.data.categoryId,
                }
            },
            updatedAt: new Date(),
        },
        include: {
            category: true,
        },
    });

    if (!fileExists) {
        await log("CREATE", "FILE", `Created file ${file.name}`);
    } else {
        await log("UPDATE", "FILE", `Updated file ${file.name}`);
    }

    revalidatePath(`/admin/files/${file.category.id}`);
    revalidatePath(`/admin/files/${file.category.id}/${file.id}`);
    revalidatePath('/admin/files');
    return {file}
}