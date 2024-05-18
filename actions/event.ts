'use server';

import {revalidatePath} from "next/cache";
import prisma from "@/lib/db";
import {log} from "@/actions/log";

export const deleteEvent = async (id: string) => {
    revalidatePath('/admin/events');
    const data = await prisma.event.delete({
        where: {
            id,
        },
    });
    await log('DELETE', 'EVENT', `Deleted event ${data.name}`)
    return data;
}