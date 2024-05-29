'use server';
import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";
import {z} from "zod";

export const deleteLesson = async (id: string) => {
    const lesson = await prisma.lesson.delete({
        where: {id}
    });

    await log("DELETE", "LESSON", `Deleted lesson ${lesson.identifier} - ${lesson.name}`);
    revalidatePath("/training/lessons");
}

export const createOrUpdateLessonDetails = async (formData: FormData) => {
    const ldz = z.object({
        identifier: z.string(),
        name: z.string(),
        facility: z.string(),
        description: z.string(),
        lessonId: z.string().optional(),
    });

    const result = ldz.safeParse({
        identifier: formData.get("identifier") as string,
        name: formData.get("name") as string,
        facility: formData.get("facility") as string,
        description: formData.get("description") as string,
        lessonId: formData.get("lessonId") as string,
    });

    if (!result.success) {
        return {id: null, error: result.error};
    }

    if (result.data.lessonId) {
        await prisma.lesson.update({
            where: {id: result.data.lessonId},
            data: {
                identifier: result.data.identifier,
                name: result.data.name,
                facility: result.data.facility,
                description: result.data.description,
                updatedAt: new Date(),
                rubric: {
                    create: {
                        items: {
                            create: [],
                        },
                    },
                },
            },
        });

        await log("UPDATE", "LESSON", `Updated lesson ${result.data.identifier} - ${result.data.name}`);
    } else {
        const lesson = await prisma.lesson.create({
            data: {
                identifier: result.data.identifier,
                name: result.data.name,
                facility: result.data.facility,
                description: result.data.description,
                updatedAt: new Date(),
            },
        });

        await log("CREATE", "LESSON", `Created lesson ${result.data.identifier} - ${result.data.name}`);
        return {id: lesson.id, error: null};
    }

    revalidatePath("/training/lessons");
    revalidatePath(`/training/lessons/${result.data.lessonId || ''}`);

    return {id: result.data.lessonId, error: null};
}