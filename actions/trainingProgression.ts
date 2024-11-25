'use server';

import {GridFilterItem, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import {Prisma} from "@prisma/client";
import prisma from "@/lib/db";
import {log} from "@/actions/log";
import {z} from "zod";
import {revalidatePath} from "next/cache";

export const createOrUpdateTrainingProgression = async (formData: FormData) => {
    const trainingProgressionZ = z.object({
        id: z.string().optional(),
        name: z.string().min(1, {message: "Name is required"}),
        autoAssignNewHomeObs: z.boolean(),
        autoAssignNewVisitor: z.boolean(),
    });

    const result = trainingProgressionZ.safeParse({
        id: formData.get('id') as string,
        name: formData.get('name') as string,
        autoAssignNewHomeObs: formData.get('autoAssignNewHomeObs') === 'on',
        autoAssignNewVisitor: formData.get('autoAssignNewVisitor') === 'on',
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    const trainingProgression = await prisma.trainingProgression.upsert({
        create: {
            name: result.data.name,
            autoAssignNewHomeObs: result.data.autoAssignNewHomeObs,
            autoAssignNewVisitor: result.data.autoAssignNewVisitor,
        },
        update: {
            name: result.data.name,
            autoAssignNewHomeObs: result.data.autoAssignNewHomeObs,
            autoAssignNewVisitor: result.data.autoAssignNewVisitor,
        },
        where: {
            id: result.data.id,
        },
    });

    if (result.data.id) {
        await log("UPDATE", "TRAINING_PROGRESSION", `Updated training progression ${trainingProgression.name}`);
    } else {
        await log("CREATE", "TRAINING_PROGRESSION", `Created training progression ${trainingProgression.name}`);
    }

    revalidatePath('/training/progressions', 'layout');

    return {trainingProgression};
}

export const fetchTrainingProgressions = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem) => {
    const orderBy: Prisma.TrainingProgressionOrderByWithRelationInput = {};

    if (sort.length > 0) {
        const sortModel = sort[0];
        switch (sortModel.field) {
            case 'name':
                orderBy.name = sortModel.sort === 'asc' ? 'asc' : 'desc';
                break;
            case 'steps':
                orderBy.steps = {_count: sortModel.sort === 'asc' ? 'asc' : 'desc'};
                break;
            case 'students':
                orderBy.students = {_count: sortModel.sort === 'asc' ? 'asc' : 'desc'};
                break;
        }
    }

    return prisma.$transaction([
        prisma.trainingProgression.count({
            where: getWhere(filter),
        }),
        prisma.trainingProgression.findMany({
            orderBy,
            where: getWhere(filter),
            include: {
                steps: true,
                students: true,
            },
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
        })
    ]);
}

const getWhere = (filter?: GridFilterItem): Prisma.TrainingProgressionWhereInput => {
    if (!filter) return {};

    switch (filter.field) {
        case 'name':
            return {
                name: {
                    [filter.operator]: filter.value as string,
                    mode: 'insensitive',
                },
            };
        case 'steps':
            return {
                steps: {
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
                        }
                    },
                },
            };
        case 'students':
            return {
                students: {
                    some: {
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
                },
            };
        default:
            return {};
    }

}

export const deleteTrainingProgression = async (id: string) => {
    const tp = await prisma.trainingProgression.delete({
        where: {id},
    });

    await log("DELETE", "TRAINING_PROGRESSION", `Deleted training progression ${tp.name}`);

    revalidatePath('/training/progressions', 'layout');
}