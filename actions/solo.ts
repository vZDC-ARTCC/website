'use server';

import {z} from "zod";
import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";

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

    const res = await fetch(`https://api.vatusa.net/v2/solo?apikey=${process.env.VATUSA_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cid: data.controller.cid,
            position: data.position,
            expires: data.expires,
        }),
    });

    if (res.status !== 200) {
        console.error('Failed to update VATUSA API');
    }

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

    await log('DELETE', 'SOLO_CERTIFICATION', `Deleted solo certification ${ss.position} for ${ss.controller.firstName} ${ss.controller.lastName}`);

    const res = await fetch(`https://api.vatusa.net/v2/solo?apikey=${process.env.VATUSA_API_KEY}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cid: ss.controller.cid,
            position: ss.position,
        }),
    });

    if (res.status !== 200) {
        console.error('Failed to update VATUSA API');
    }

    revalidatePath('/training/solos')
    revalidatePath('/controllers/roster');
}