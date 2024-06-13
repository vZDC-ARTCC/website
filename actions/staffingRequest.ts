'use server';

import prisma from "@/lib/db";
import {StaffingRequest} from "@prisma/client";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";
import {z} from "zod";

export const createStaffingRequest = async (formData: FormData) => {

    const staffingRequestZ = z.object({
        userId: z.string(),
        name: z.string().min(1, 'Name must be at least 1 character long'),
        description: z.string().min(1, 'Description must be at least 1 character long'),
    });

    const result = staffingRequestZ.safeParse({
        userId: formData.get('userId'),
        name: formData.get('name') as string,
        description: formData.get('description') as string,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const staffingRequest = await prisma.staffingRequest.create({
        data: {
            name: result.data.name,
            description: result.data.description,
            user: {
                connect: {
                    id: result.data.userId,
                }
            }
        }
    });

    revalidatePath("/admin/staffing-requests");
    return {staffingRequest};
}

export const closeStaffingRequest = async (staffingRequest: StaffingRequest) => {
    const deletedStaffingRequest = await prisma.staffingRequest.delete({
        where: {
            id: staffingRequest.id,
        },
    });

    await log("DELETE", "STAFFING_REQUEST", `Deleted staffing request ${deletedStaffingRequest.name}`);
    revalidatePath("/admin/staffing-requests");
    return deletedStaffingRequest;
}