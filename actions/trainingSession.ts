'use server';

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


export async function deleteTrainingSession(id: string) {
    const trainingSession = await prisma.trainingSession.delete({
        where: {id},
        include: {
            student: true,
        }
    });

    await log("DELETE", "TRAINING_SESSION", `Deleted training session with student ${trainingSession.student.cid} - ${trainingSession.student.firstName} ${trainingSession.student.lastName}`);

    await deleteVatusaTrainingSession(trainingSession.vatusaId || '');
    revalidatePath('/training/sessions', "layout");

    return trainingSession;
}

export async function createOrUpdateTrainingSession(
    student: string,
    start: any,
    end: any,
    trainingTickets: {
        lesson: Lesson,
        mistakes: CommonMistake[],
        scores: RubricCriteraScore[],
        passed: boolean,
    }[],
    additionalComments: string,
    trainerComments: string,
    id?: string,
    enableMarkdown: boolean,
) {

    const trainingSessionZ = z.object({
        id: z.string().optional(),
        student: z.string().min(1, {message: "You must select a student."}),
        start: z.date({required_error: "You must select a start date."}),
        end: z.date({required_error: "You must select an end date."}).refine(end => {
            const dateStart = new Date(start);
            const diffInMinutes = (end.getTime() - dateStart.getTime()) / (1000 * 60);
            return diffInMinutes >= 5;
        }, {message: "End date must be at least 5 minutes after start date."}),
        additionalComments: z.string().optional(),
        trainerComments: z.string().optional(),
        trainingTickets: z.array(z.object({
            lesson: z.object({
                id: z.string(),
            }),
            mistakes: z.array(z.object({
                id: z.string(),
            })),
            scores: z.array(z.object({
                criteriaId: z.string(),
                cellId: z.string(),
                passed: z.boolean(),
            })),
            passed: z.boolean(),
        })).nonempty("You must add at least one training ticket."),
        enableMarkdown: z.boolean(),
    });

    const result = trainingSessionZ.safeParse({
        id,
        student,
        start,
        end,
        trainingTickets,
        additionalComments,
        trainerComments,
        enableMarkdown,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const session = await getServerSession(authOptions);

    try {
        if (id && session) {

            const oldTickets = await prisma.trainingTicket.findMany({
                where: {
                    sessionId: id,
                },
                include: {
                    lesson: true,
                },
            });

            const trainingSession = await prisma.trainingSession.update({
                where: {id},
                data: {
                    start,
                    end,
                    additionalComments: result.data.additionalComments,
                    trainerComments: result.data.trainerComments,
                    tickets: {
                        create: result.data.trainingTickets.map((t) => ({
                            lesson: {connect: {id: t.lesson.id}},
                            mistakes: {connect: t.mistakes.map((m) => ({id: m.id}))},
                            scores: {
                                create: t.scores.map((s) => (
                                    {
                                        criteria: {connect: {id: s.criteriaId}},
                                        cell: {
                                            connect: {id: s.cellId}
                                        },
                                        passed: s.passed
                                    }
                                ))
                            },
                            passed: t.passed,
                        })),
                    },
                    enableMarkdown,
                },
                include: {
                    student: true,
                    tickets: {
                        include: {
                            lesson: true,
                        },
                    },
                },
            });

            await prisma.trainingTicket.deleteMany({
                where: {
                    id: {
                        in: oldTickets.map((t) => t.id),
                    },
                },
            })

            await log("UPDATE", "TRAINING_SESSION", `Updated training session with student ${trainingSession.student.cid} - ${trainingSession.student.firstName} ${trainingSession.student.lastName}`);

            const updateStatus = await editVatusaTrainingSession(session.user.cid, start, trainingSession.tickets[0].lesson.position || 'N/A', getDuration(trainingSession.start, trainingSession.end), result.data.additionalComments || '', trainingSession.vatusaId || '');

            if (updateStatus !== 'OK'){
                throw new Error("Failed to update ticket")
            }

            revalidatePath('/training/sessions', "layout");

            for (const newTicket of trainingSession.tickets) {
                const oldTicket = oldTickets.find((ticket) => ticket.id === newTicket.id);

                if (oldTicket && !oldTicket.passed && newTicket.passed && newTicket.lesson.notifyInstructorOnPass) {
                    await sendInstructorsTrainingSessionCreatedEmail(trainingSession.student as User, session.user, trainingSession, newTicket.lesson);
                }
            }

            return {session: trainingSession};

        } else if (session) {

            const trainingSession = await prisma.trainingSession.create({
                data: {
                    student: {connect: {id: result.data.student}},
                    instructor: {connect: {id: session.user.id}},
                    start,
                    end,
                    additionalComments: result.data.additionalComments,
                    trainerComments: result.data.trainerComments,
                    tickets: {
                        create: result.data.trainingTickets.map((t) => ({
                            lesson: {connect: {id: t.lesson.id}},
                            mistakes: {connect: t.mistakes.map((m) => ({id: m.id}))},
                            scores: {
                                create: t.scores.map((s) => (
                                    {
                                        criteria: {connect: {id: s.criteriaId}},
                                        cell: {
                                            connect: {id: s.cellId}
                                        },
                                        passed: s.passed
                                    }
                                ))
                            },
                            passed: t.passed,
                        })),
                    },
                    enableMarkdown,
                },
                include: {
                    student: true,
                    instructor: true,
                    tickets: {
                        include: {
                            lesson: true,
                        },
                    },
                },
            });

            await log("CREATE", "TRAINING_SESSION", `Created training session with student ${trainingSession.student.cid} - ${trainingSession.student.firstName} ${trainingSession.student.lastName}`);

            const vatusaId = await createVatusaTrainingSession(trainingSession.tickets[0].lesson.location, trainingSession.student.cid, session.user.cid, start, trainingSession.tickets[0].lesson.position || 'N/A', getDuration(trainingSession.start, trainingSession.end), result.data.additionalComments || '');

            await prisma.trainingSession.update({
                where: {id: trainingSession.id},
                data: {
                    vatusaId: vatusaId,
                }
            });

            await sendTrainingSessionCreatedEmail(trainingSession.student as User, session.user, trainingSession);

            revalidatePath('/training/sessions', "layout");

            for (const newTicket of trainingSession.tickets) {
                if (newTicket.passed && newTicket.lesson.notifyInstructorOnPass) {
                    await sendInstructorsTrainingSessionCreatedEmail(trainingSession.student as User, session.user, trainingSession, newTicket.lesson);
                }
            }

            return {session: trainingSession};
        } else {
            return {
                errors: [{
                    message: "You must be logged in to perform this action."
                }]
            };
        }

    } catch (e) {
        console.log(e);
        return {errors: [{message: "An error occurred when trying to save training ticket. Try refreshing the page."}]};
    }


}

export const fetchTrainingSessions = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem, onlyUser?: User) => {
    const orderBy: Prisma.TrainingSessionOrderByWithRelationInput = {};
    if (sort.length > 0) {
        orderBy[sort[0].field === 'start' ? 'start' : 'end'] = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }

    return prisma.$transaction([
        prisma.trainingSession.count({
            where: getWhere(filter, onlyUser),
        }),
        prisma.trainingSession.findMany({
            orderBy,
            where: getWhere(filter, onlyUser),
            include: {
                student: true,
                instructor: true,
                tickets: {
                    include: {
                        lesson: true,
                        mistakes: true,
                    },
                },
            },
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
        })
    ]);
}

const getWhere = (filter?: GridFilterItem, onlyUser?: User): Prisma.TrainingSessionWhereInput => {
    if (!filter) {
        return onlyUserWhere(onlyUser);
    }
    switch (filter?.field) {
        case 'student':
            return {
                student: {
                    OR: [
                        {
                            cid: {
                                [filter.operator]: filter.value as string,
                                mode: 'insensitive',
                            }
                        },
                        {
                            fullName: {
                                [filter.operator]: filter.value as string,
                                mode: 'insensitive',
                            }
                        },
                    ],
                },
            };
        case 'trainer':
            return {
                instructor: {
                    OR: [
                        {
                            cid: {
                                [filter.operator]: filter.value as string,
                                mode: 'insensitive',
                            }
                        },
                        {
                            fullName: {
                                [filter.operator]: filter.value as string,
                                mode: 'insensitive',
                            }
                        },
                    ],
                },
            };
        case 'lessons':
            return {
                tickets: {
                    some: {
                        lesson: {
                            OR: [
                                {
                                    identifier: {
                                        [filter.operator]: filter.value,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    name: {
                                        [filter.operator]: filter.value,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        },
                    },
                },
            };
        default:
            return onlyUserWhere(onlyUser);
    }
}

const onlyUserWhere = (onlyUser?: User): Prisma.TrainingSessionWhereInput => {
    if (onlyUser) {
        return {
            student: {
                id: onlyUser.id,
            }
        }
    }
    return {};
}