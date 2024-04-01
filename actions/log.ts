'use server';

import {LogModel, LogType, Prisma} from "@prisma/client";
import prisma from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {GridFilterItem, GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";

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

export const fetchLogs = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem) => {

    const orderBy: Prisma.LogOrderByWithRelationInput = {};
    if (sort.length > 0) {
        orderBy.timestamp = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }

    return prisma.$transaction([
        prisma.log.count({
            where: filter ? (filter.field === 'user' ? {
                user: {
                    OR: [
                        {
                            fullName: {
                                [filter.operator]: filter.value,
                                mode: 'insensitive',
                            },
                        },
                        {
                            cid: {
                                [filter.operator]: filter.value,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
            } : {

                [filter.field]: {
                    equals: filter.value,
                },
            }) : undefined,
        }),
        prisma.log.findMany({
            orderBy,
            include: {
                user: true,
            },
            where: filter ? (filter.field === 'user' ? {
                user: {
                    OR: [
                        {
                            fullName: {
                                [filter.operator]: filter.value,
                                mode: 'insensitive',
                            },
                        },
                        {
                            cid: {
                                [filter.operator]: filter.value,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
            } : {

                [filter.field]: {
                    equals: filter.value,
                },
            }) : undefined,
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
        })
    ]);
}