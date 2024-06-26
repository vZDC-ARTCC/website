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

    const fileCategoryExists = await prisma.fileCategory.findFirst({
        where: {id: result.data.id || ''},
    });

    const fileCategory = await prisma.fileCategory.upsert({
        where: {id: result.data.id},
        update: {
            name: result.data.name,
        },
        create: {
            name: result.data.name,
        },
    });

    if (!fileCategoryExists) {
        await log("CREATE", "FILE_CATEGORY", `Created file category ${fileCategory.name}`);
    } else {
        await log("UPDATE", "FILE_CATEGORY", `Updated file category ${fileCategory.name}`);
    }

    revalidatePath('/admin/files');

    return {fileCategory};
}

export const deleteFileCategory = async (id: string) => {

    const fileCategory = await prisma.fileCategory.delete({
        where: {id},
        include: {
            files: true,
        }
    });

    await ut.deleteFiles(fileCategory.files.map((file) => file.key));

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

    const inputFile = formData.get('file') as File;
    const res = await ut.uploadFiles(inputFile);
    if (res.error) {
        console.log(res.error);
        throw new Error("Error saving file");
    }
    if (fileExists) {
        await ut.deleteFiles(fileExists.key);
    }

    const file = await prisma.file.upsert({
        where: {id: result.data.id || ''},
        update: {
            name: result.data.name,
            description: result.data.description,
            key: res.data.key,
            updatedAt: new Date(),
        },
        create: {
            name: result.data.name,
            description: result.data.description,
            key: res.data.key,
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
    const file = await prisma.file.delete({
        where: {id},
    });

    await ut.deleteFiles(file.key);

    await log("DELETE", "FILE", `Deleted file ${file.name}`);

    revalidatePath('/admin/files');
    revalidatePath(`/admin/files/${file.categoryId}`);
}

