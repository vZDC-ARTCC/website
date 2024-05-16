import React from 'react';
import prisma from "@/lib/db";
import StatisticsTable from "@/components/Statistics/StatisticsTable";
import {Card, CardContent, Typography} from "@mui/material";
import {notFound} from "next/navigation";
import {getRating} from "@/lib/vatsim";

export default async function Page({params, searchParams,}: {
    params: { cid: string },
    searchParams: { year?: string, }
}) {

    const year = searchParams.year || new Date().getFullYear().toString();

    const controller = await prisma.user.findUnique({
        where: {
            cid: params.cid,
            controllerStatus: {
                not: 'NONE',
            },
        },
    });

    if (!controller) {
        notFound();
    }

    const monthLogs = await prisma.controllerLogMonth.findMany({
        where: {
            log: {
                user: {
                    cid: params.cid,
                },
            },
            year: parseInt(year)
        }
    });

    return (
        <Card sx={{mt: 2,}}>
            <CardContent>
                <Typography
                    variant="h6">{controller.preferredName || `${controller.firstName} ${controller.lastName}`}</Typography>
                <Typography>{controller.preferredName && `${controller.firstName} ${controller.lastName}`}</Typography>
                <Typography sx={{mb: 2,}}>{getRating(controller.rating)} • {controller.cid}</Typography>
                <StatisticsTable basePath={`/controllers/statistics/${params.cid}`} logs={monthLogs}
                                 year={parseInt(year)}/>
            </CardContent>
        </Card>
    );
}