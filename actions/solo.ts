'use server';

import {z} from "zod";
import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";
import {addVatusaSolo, deleteVatusaSolo} from "@/actions/vatusa/controller";
import {sendSoloAddedEmail, sendSoloDeletedEmail, sendSoloExpiredEmail} from "@/actions/mail/solo";
import {User} from "next-auth";

export const addSolo = async (formData: FormData) => {

    const soloZ = z.object({
        controller: z.string(),
        certificationType: z.string(),
        position: z.string(),
        expires: z.string(),
    });

    const result = soloZ.safeParse({
        controller: formData.get('controller') as string,
        certificationType: formData.get('certificationType') as string,
        position: formData.get('position') as string,
        expires: formData.get('expires') as string,
    });

    if (!result.success) {
        return result.error;
    }

    const data = await prisma.soloCertification.create({
        data: {
            controller: {
                connect: {
                    id: result.data.controller,
                }
            },
            certificationType: {
                connect: {
                    id: result.data.certificationType,
                }
            },
            position: result.data.position,
            expires: new Date(result.data.expires),
        },
        include: {
            controller: true,
        },
    });

    await prisma.certification.upsert({
        create: {
            certificationOption: 'SOLO',
            certificationTypeId: result.data.certificationType,
            userId: result.data.controller,
        },
        update: {
            certificationOption: 'SOLO',
        },
        where: {
            certificationOption_userId: {
                certificationOption: 'SOLO',
                userId: result.data.controller,
            },
        },
    });

    await sendSoloAddedEmail(data.controller as User, data);

    await log('CREATE', 'SOLO_CERTIFICATION', `Created solo certification ${data.position} for ${data.controller.firstName} ${data.controller.lastName}`);

    await addVatusaSolo(data.controller.cid, data.position, data.expires);

    revalidatePath('/training/solos');
    revalidatePath('/controllers/roster');

}

export const deleteSolo = async (id: string) => {
    const ss = await prisma.soloCertification.delete({
        where: {
            id,
        },
        include: {
            controller: true,
        }
    });

    await sendSoloDeletedEmail(ss.controller as User, ss);

    await log('DELETE', 'SOLO_CERTIFICATION', `Deleted solo certification ${ss.position} for ${ss.controller.firstName} ${ss.controller.lastName}`);

    await deleteVatusaSolo(ss.controller.cid, ss.position);

    revalidatePath('/training/solos')
    revalidatePath('/controllers/roster');
}

export const deleteExpiredSolos = async () => {
    const solos = await prisma.soloCertification.findMany({
        where: {
            expires: {
                lte: new Date(),
            }
        },
        include: {
            controller: true,
        }
    });

    for (const solo of solos) {
        await prisma.soloCertification.delete({
            where: {
                id: solo.id,
            }
        });

        await sendSoloExpiredEmail(solo.controller as User, solo);

        await log('DELETE', 'SOLO_CERTIFICATION', `Deleted expired solo certification ${solo.position} for ${solo.controller.firstName} ${solo.controller.lastName}`);

        await deleteVatusaSolo(solo.controller.cid, solo.position);
    }

    revalidatePath('/training/solos');
    revalidatePath('/controllers/roster');
}