'use server'
import prisma from "@/lib/db";
import {z} from "zod";


export async function createChangeLog(versionNumber: string, changeLogDetails: string) {

    const changeLogZ = z.object({
        versionNumber: z.string().min(1, {message: "You must include a version number."}),
        changeLogDetails: z.string().min(1, {message: "You must include change log details."}),
    });

    const result = changeLogZ.safeParse({
        versionNumber,
        changeLogDetails
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const addChangeLog = await prisma.version.create({
        data: {
            versionNumber: result.data.versionNumber,
            changeDetails: {
                create: {
                    detail: result.data.changeLogDetails,
                }
            }
        }
    })

    // await log("CREATE", "CHANGE_LOG", `Created change log for website version ${result.data.versionNumber}`);

    return addChangeLog
}