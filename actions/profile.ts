'use server';

import {z} from "zod";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";

export const updateCurrentProfile = async (user: User) => {
    const User = z.object({
        preferredName: z.string().max(40, "Preferred name must not be over 40 characters").optional(),
        bio: z.string().max(400, "Bio must not be over 400 characters").optional(),
    });

    const result = User.parse(user);

    await prisma.user.update({
        data: result,
        where: {
            id: user.id
        },
    });

    revalidatePath('/profile/overview');
    revalidatePath(`/admin/controller/${user.cid}`);
    revalidatePath('/controllers/roster', "layout");
}