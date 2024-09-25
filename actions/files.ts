'use server';

import {UTApi} from "uploadthing/server";
import {z} from "zod";
import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";

const ut = new UTApi();

export const createOrUpdateFileCategory = async (formData: FormData) => {
    const fileCategoryZ = z.object({
        id: z.string().optional(),
        name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    });

    const result = fileCategoryZ.safeParse({
        id: formData.get('id') as string,
        name: formData.get('name') as string,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const fileCategory = await prisma.fileCategory.upsert({
        where: {id: result.data.id || ''},
        update: {
            name: result.data.name,
        },
        create: {
            name: result.data.name,
        },
    });

    if (result.data.id) {
        await log("UPDATE", "FILE_CATEGORY", `Updated file category ${fileCategory.name}`);
    } else {
        await log("CREATE", "FILE_CATEGORY", `Created file category ${fileCategory.name}`);
    }

    revalidatePath('/admin/files');
    return {fileCategory}
}

export const deleteFileCategory = async (id: string) => {
    const fileCategory = await prisma.fileCategory.findUnique({
        where: {id},
        include: {
            files: true,
        },
    });

    if (!fileCategory) {
        return;
    }

    for (const file of fileCategory.files) {
        await ut.deleteFiles(file.key);
        await prisma.file.delete({
            where: {id: file.id},
        });
    }

    await prisma.fileCategory.delete({
        where: {id},
    });

    await log("DELETE", "FILE_CATEGORY", `Deleted file category ${fileCategory.name}`);
    revalidatePath('/admin/files');
}

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

export const deleteFile = async (id: string) => {
    const file = await prisma.file.findUnique({
        where: {id},
        include: {
            category: true,
        },
    });

    if (!file) {
        return;
    }

    await ut.deleteFiles(file.key);

    await prisma.file.delete({
        where: {id},
    });

    await ut.deleteFiles(file.key);
    await log("DELETE", "FILE", `Deleted file ${file.name}`);
    revalidatePath(`/admin/files/${file.category.id}`);
    revalidatePath('/admin/files');
}