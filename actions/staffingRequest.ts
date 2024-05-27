'use server';

import {User} from "next-auth";
import prisma from "@/lib/db";
import {StaffingRequest} from "@prisma/client";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";

export const createStaffingRequest = async (user: User, name: string, description: string) => {

    if (!name || !description) {
        throw new Error('Name and description are required');
    }

    const staffingRequestClient = await prisma.staffingRequest.create({
        data: {
            name,
            description,
            user: {
                connect: {
                    id: user.id,
                }
            }
        }
    });

    revalidatePath("/admin/staffing-requests");
    return staffingRequestClient;
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