'use server';

import {Certification} from "@prisma/client";
import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {writeDossier} from "@/actions/dossier";
import {log} from "@/actions/log";

export const saveCertifications = async (cid: string, certifications: Certification[], dossierMessage: string) => {
    for (const certification of certifications) {
        if (certification.id) {
            await prisma.certification.update({
                where: {
                    id: certification.id,
                },
                data: {
                    certificationOption: certification.certificationOption,
                },
            });
        } else {
            await prisma.certification.create({
                data: {
                    certificationOption: certification.certificationOption,
                    certificationType: {
                        connect: {
                            id: certification.certificationTypeId,
                        },
                    },
                    controller: {
                        connect: {
                            cid,
                        },
                    },
                },
            });
        }
    }
    await log("UPDATE", "CERTIFICATION", `Updated certifications for ${cid}`);
    await writeDossier(dossierMessage, cid);
    revalidatePath('/profile/overview');
}