'use server';

import {UTApi} from "uploadthing/server";
import {FileCategory} from "@prisma/client";
import {z} from "zod";
import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";

const ut = new UTApi();

export const createOrUpdateFileCategory = async (fileCategory: FileCategory) => {

    const fileCategoryZ = z.object({
        name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    });

    const result = fileCategoryZ.parse(fileCategory);

    const fileCategoryExists = await prisma.fileCategory.findFirst({
        where: {id: fileCategory.id},
    });

    const data = await prisma.fileCategory.upsert({
        where: {id: fileCategory.id},
        update: result,
        create: result,
    });

    if (!fileCategoryExists) {
        await log("CREATE", "FILE_CATEGORY", `Created file category ${data.name}`);
    } else {
        await log("UPDATE", "FILE_CATEGORY", `Updated file category ${data.name}`);
    }

    revalidatePath('/admin/files');

    return data;
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

export const createOrUpdateFile = async (formData: FormData, category: FileCategory, id?: string) => {
    const fileZ = z.object({
        name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
        description: z.string().max(255, 'Description is too long'),
    });

    const result = fileZ.safeParse({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
    });

    if (!result.success) {
        return result.error;
    }

    const fileExists = await prisma.file.findUnique({
        where: {
            id: id || '',
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

    const data = await prisma.file.upsert({
        where: {id: id || ''},
        update: {
            ...result.data,
            key: res.data.key,
            updatedAt: new Date(),
        },
        create: {
            ...result.data,
            key: res.data.key,
            category: {
                connect: {
                    id: category.id,
                }
            },
            updatedAt: new Date(),
        },
    });

    if (!fileExists) {
        await log("CREATE", "FILE", `Created file ${data.name}`);
    } else {
        await log("UPDATE", "FILE", `Updated file ${data.name}`);
    }

    revalidatePath(`/admin/files/${category.id}`);
    revalidatePath(`/admin/files/${category.id}/${data.id}`);
    revalidatePath('/admin/files');

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

