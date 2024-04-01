'use server';

import {CertificationOption, CertificationType} from "@prisma/client";
import {z} from "zod";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {log} from "@/actions/log";

export const createOrUpdateCertificationType = async (certificationType: CertificationType) => {
    const CertificationType = z.object({
        name: z.string().min(1, "Name is required").max(20, "Name cannot be longer than 20 characters"),
        order: z.number().int("Order must be a whole number"),
        canSoloCert: z.boolean(),
        certificationOptions: z.array(z.nativeEnum(CertificationOption)),
    });

    const result = CertificationType.parse(certificationType);

    const certificationTypeExists = !!(await prisma.certificationType.findUnique({
        where: {
            id: certificationType.id,
        }
    }));

    const data = await prisma.certificationType.upsert({
        create: result,
        update: result,
        where: {
            id: certificationType.id,
        }
    });

    if (certificationTypeExists) {
        await log('UPDATE', 'CERTIFICATION_TYPE', `Updated certification type ${data.name}`);
    } else {
        await log('CREATE', 'CERTIFICATION_TYPE', `Created certification type ${data.name}`);
    }

    revalidatePath('/admin/certifications');
    return data;
}

export const deleteCertificationType = async (id: string) => {
    revalidatePath('/admin/certifications');
    const data = await prisma.certificationType.delete({
        where: {
            id,
        },
    });
    await log('DELETE', 'CERTIFICATION_TYPE', `Deleted certification type ${data.name}`)
    return data;
}