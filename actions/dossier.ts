'use server';

import prisma from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {revalidatePath} from "next/cache";

export const writeDossier = async (message: string, cid: string) => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return;
    }

    await prisma.dossierEntry.create({
        data: {
            user: {
                connect: {
                    cid,
                }
            },
            writer: {
                connect: {
                    cid: session.user.cid,
                },
            },
            message,
            timestamp: new Date(),
        },
    });
    revalidatePath(`/admin/controller/${cid}`);
}