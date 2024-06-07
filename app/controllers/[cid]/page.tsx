import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Grid, Typography} from "@mui/material";
import ProfileCard from "@/components/Profile/ProfileCard";
import {User} from "next-auth";
import StatisticsTable from "@/components/Statistics/StatisticsTable";
import {getMonthLog} from "@/lib/hours";
import ControllingSessionsTable from "@/components/Statistics/ControllingSessionsTable";

export default async function Page({params}: { params: { cid: string } }) {

    const {cid} = params;

    const user = await prisma.user.findUnique({
        where: {
            cid,
            controllerStatus: {
                not: 'NONE',
            },
        },
    });

    if (!user) {
        notFound();
    }

    const logs = await prisma.controllerLogMonth.findMany({
        where: {
            year: new Date().getFullYear(),
            log: {
                user: {
                    cid,
                },
            },
        },
        include: {
            log: {
                include: {
                    user: true
                }
            }
        }
    });

    const positionsWorked = await prisma.controllerPosition.findMany({
        where: {
            log: {
                user: {
                    cid,
                },
            },
            start: {
                gte: new Date(new Date().getFullYear(), 0, 1),
                lt: new Date(new Date().getFullYear() + 1, 0, 1)
            },
        },
        orderBy: {
            start: 'desc',
        },
    });

    return (
        <Grid container columns={2} spacing={2}>
            <Grid item xs={2}>
                <ProfileCard user={user as User} viewOnly/>
            </Grid>
            <Grid item xs={2} lg={1}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">{new Date().getFullYear()} Statistics</Typography>
                        <StatisticsTable heading="Month" logs={getMonthLog(logs)}/>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={2} lg={1}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">{new Date().getFullYear()} Controlling Sessions</Typography>
                        <ControllingSessionsTable positions={positionsWorked}/>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}