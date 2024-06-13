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
        location: z.number().min(0).max(2),
        facility: z.string(),
        position: z.string(),
        description: z.string(),
        instructorOnly: z.boolean(),
        notifyInstructorOnPass: z.boolean(),
        lessonId: z.string().optional(),
    });

    const result = ldz.safeParse({
        identifier: formData.get("identifier") as string,
        name: formData.get("name") as string,
        location: parseInt(formData.get("location") as string),
        facility: formData.get("facility") as string,
        position: formData.get("position") as string,
        description: formData.get("description") as string,
        instructorOnly: formData.get("instructorOnly") === "on",
        notifyInstructorOnPass: formData.get("notifyInstructorOnPass") === "on",
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
                location: result.data.location,
                position: result.data.position,
                description: result.data.description,
                instructorOnly: result.data.instructorOnly,
                notifyInstructorOnPass: result.data.notifyInstructorOnPass,
                updatedAt: new Date(),
            },
        });

        await log("UPDATE", "LESSON", `Updated lesson ${result.data.identifier} - ${result.data.name}`);
    } else {
        const lesson = await prisma.lesson.create({
            data: {
                identifier: result.data.identifier,
                name: result.data.name,
                location: result.data.location,
                facility: result.data.facility,
                position: result.data.position,
                description: result.data.description,
                instructorOnly: result.data.instructorOnly,
                notifyInstructorOnPass: result.data.notifyInstructorOnPass,
                updatedAt: new Date(),
            },
        });

        await log("CREATE", "LESSON", `Created lesson ${result.data.identifier} - ${result.data.name}`);
        return {id: lesson.id, error: null};
    }

    revalidatePath(`/training/lessons/`, "layout");

    return {id: result.data.lessonId, error: null};
}