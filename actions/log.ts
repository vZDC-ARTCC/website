'use server';

import {LogModel, LogType, Prisma} from "@prisma/client";
import prisma from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {GridFilterItem, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";

export const log = async (type: LogType, model: LogModel, message: string) => {

    const session = await getServerSession(authOptions);

    if (session) {
        await prisma.log.create({
            data: {
                user: {
                    connect: {
                        id: session.user.id,
                    }
                },
                timestamp: new Date(),
                type,
                model,
                message,
            }
        })
    }
}

export const fetchLogs = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem, onlyModels?: LogModel[]) => {

    const orderBy: Prisma.LogOrderByWithRelationInput = {};
    if (sort.length > 0) {
        orderBy.timestamp = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }

    return prisma.$transaction([
        prisma.log.count({
            where: filter ? filter?.field === 'model' ? {
                model: {
                    in: [...(onlyModels || []), filter.field === 'model' && filter.value].filter((v) => !!v),
                },
            } : {
                model: {
                    in: onlyModels || Object.values(LogModel),
                },
                [filter.field]: {
                    equals: filter.value,
                },
            } : undefined,
        }),
        prisma.log.findMany({
            orderBy,
            include: {
                user: true,
            },
            where: filter ? filter?.field === 'model' ? {
                model: {
                    in: [...(onlyModels || []), filter.field === 'model' && filter.value].filter((v) => !!v),
                },
            } : {
                model: {
                    in: onlyModels || Object.values(LogModel),
                },
                [filter.field]: {
                    equals: filter.value,
                },
            } : {
                model: {
                    in: onlyModels || Object.values(LogModel),
                },
            },
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
        })
    ]);
}