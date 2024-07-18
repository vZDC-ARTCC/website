'use server'
import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {CommonMistake, Lesson, Prisma, RubricCriteraScore} from "@prisma/client";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import {
    createVatusaTrainingSession,
    deleteVatusaTrainingSession,
    editVatusaTrainingSession
} from "@/actions/vatusa/training";
import {getDuration} from "@/lib/date";
import {sendInstructorsTrainingSessionCreatedEmail, sendTrainingSessionCreatedEmail} from "@/actions/mail/training";
import {GridFilterItem, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";

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