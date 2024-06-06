'use server';

import {z} from "zod";
import prisma from "@/lib/db";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import {revalidatePath} from "next/cache";
import {IncidentReport} from "@prisma/client";
import {sendIncidentReportClosedEmail} from "@/actions/mail/incident";

export const createIncident = async (formData: FormData) => {
    const reportZ = z.object({
        reporteeCallsign: z.string(),
        reporterCallsign: z.string().optional(),
        reason: z.string(),
        reporteeId: z.string(),
        timestamp: z.date().refine((d) => d < new Date(), {message: 'Date must be in the past.'}),
    });

    const result = reportZ.safeParse({
        reporteeCallsign: formData.get('reporteeCallsign'),
        reporterCallsign: formData.get('reporterCallsign'),
        reason: formData.get('reason'),
        reporteeId: formData.get('reporteeId'),
        timestamp: new Date(formData.get('timestamp') as unknown as string),
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const session = await getServerSession(authOptions);

    const report = await prisma.incidentReport.create({
        data: {
            reporter: {
                connect: {
                    id: session?.user.id,
                },
            },
            reportee: {
                connect: {
                    id: result.data.reporteeId,
                },
            },
            closed: false,
            reporteeCallsign: result.data.reporteeCallsign,
            reporterCallsign: result.data.reporterCallsign,
            reason: result.data.reason,
            timestamp: result.data.timestamp,
        },
    });

    revalidatePath('/admin/incidents');

    return {report};
}

export const closeIncident = async (report: IncidentReport) => {
    const incident = await prisma.incidentReport.update({
        where: {
            id: report.id,
        },
        data: {
            closed: true,
        },
        include: {
            reporter: true,
            reportee: true,
        },
    });

    await sendIncidentReportClosedEmail(incident.reporter as User, incident.reportee as User);

    revalidatePath('/admin/incidents');
    revalidatePath(`/admin/incidents/${report.id}`);

}