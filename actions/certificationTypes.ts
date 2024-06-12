'use server';

import {CertificationOption} from "@prisma/client";
import {z} from "zod";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {log} from "@/actions/log";

export const createOrUpdateCertificationType = async (formData: FormData) => {
    const certificationTypeZ = z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Name is required").max(20, "Name cannot be longer than 20 characters"),
        order: z.number().int("Order must be a whole number"),
        canSoloCert: z.boolean(),
        certificationOptions: z.array(z.nativeEnum(CertificationOption)),
    });

    const result = certificationTypeZ.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        order: parseInt(formData.get('order') as string),
        canSoloCert: formData.get('canSoloCert') === 'on',
        certificationOptions: (formData.get('certificationOptions') as unknown as string).split(',') as CertificationOption[],
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const certificationType = await prisma.certificationType.upsert({
        create: {
            name: result.data.name,
            order: result.data.order,
            canSoloCert: result.data.canSoloCert,
            certificationOptions: result.data.certificationOptions,
        },
        update: {
            name: result.data.name,
            order: result.data.order,
            canSoloCert: result.data.canSoloCert,
            certificationOptions: result.data.certificationOptions,
        },
        where: {
            id: result.data.id || '',
        },
    });

    await log(result.data.id ? 'UPDATE' : 'CREATE', 'CERTIFICATION_TYPE', `Saved certification type ${certificationType.name}`);

    revalidatePath('/admin/certifications');
    return {certificationType};
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