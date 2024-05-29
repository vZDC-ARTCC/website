'use server';

import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";
import {z} from "zod";

export const deleteMistake = async (id: string) => {
    const mistake = await prisma.commonMistake.delete({
        where: {
            id,
        },
    });

    await log("DELETE", "COMMON_MISTAKE", `Deleted mistake ${mistake.name} - ${mistake.facility || 'N/A'}`);
    revalidatePath('/training/mistakes');
}

export const createOrUpdateMistake = async (formData: FormData) => {
    const mistakeZ = z.object({
        name: z.string().min(1, "Name is required"),
        facility: z.string().optional(),
        description: z.string().min(1, "Description is required"),
        mistakeId: z.string().optional(),
    });

    const result = mistakeZ.safeParse({
        name: formData.get('name'),
        facility: formData.get('facility'),
        description: formData.get('description'),
        mistakeId: formData.get('mistakeId'),
    });

    if (!result.success) {
        return result.error;
    }

    if (result.data.mistakeId) {
        const mistake = await prisma.commonMistake.update({
            where: {
                id: result.data.mistakeId,
            },
            data: {
                name: result.data.name,
                facility: result.data.facility,
                description: result.data.description,
            },
        });

        await log("UPDATE", "COMMON_MISTAKE", `Updated mistake ${mistake.name} - ${mistake.facility || 'N/A'}`);
        revalidatePath(`/training/mistakes/${mistake.id}`);
    } else {
        const mistake = await prisma.commonMistake.create({
            data: {
                name: result.data.name,
                facility: result.data.facility,
                description: result.data.description,
            },
        });

        await log("CREATE", "COMMON_MISTAKE", `Created mistake ${mistake.name} - ${mistake.facility || 'N/A'}`);
    }

    revalidatePath('/training/mistakes');
}