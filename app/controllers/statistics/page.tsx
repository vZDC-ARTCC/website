import React from 'react';
import prisma from "@/lib/db";
import {Box, Card, CardContent, Grid, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import {User} from "next-auth";
import {OpenInNew, StackedLineChart, Visibility} from "@mui/icons-material";
import Link from "next/link";
import {getRating} from "@/lib/vatsim";
import StatisticsTable from "@/components/Statistics/StatisticsTable";
import {ControllerLogMonth} from "@prisma/client";

export default async function Page({searchParams}: { searchParams: { year?: string, } }) {

    // Get the current month and year
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

// Get the logs for the current month and year
    const monthLogs = await prisma.controllerLogMonth.findMany({
        where: {
            month,
            year,
        },
        include: {
            log: {
                include: {
                    user: true
                }
            }
        }
    });

    const facilityYearLogs = await prisma.controllerLogMonth.findMany({
        where: {
            year: searchParams.year ? parseInt(searchParams.year) : year,
        },
        include: {
            log: {
                include: {
                    user: true
                }
            }
        }
    });

    const consolidatedLog = facilityYearLogs.reduce((acc, log) => {
        const month = log.month;

        // If the month is not yet a key in the accumulator, add it with an object with initial values
        if (!acc[month]) {
            acc[month] = {
                month,
                year: searchParams.year ? parseInt(searchParams.year) : year,
                id: '',
                logId: '',
                deliveryHours: 0,
                groundHours: 0,
                towerHours: 0,
                approachHours: 0,
                centerHours: 0
            };
        }

        // Add the hours to the object for its month
        acc[month].deliveryHours += log.deliveryHours;
        acc[month].groundHours += log.groundHours;
        acc[month].towerHours += log.towerHours;
        acc[month].approachHours += log.approachHours;
        acc[month].centerHours += log.centerHours;

        return acc;
    }, [] as ControllerLogMonth[]);

// Map the logs to an array of { user, totalHours }
    const controllersWithHours = monthLogs.map(log => {
        const totalHours = log.deliveryHours + log.groundHours + log.towerHours + log.approachHours + log.centerHours;
        return {user: log.log.user, totalHours};
    });

    // Sort the array by totalHours in descending order and take the top 3
    const top3Controllers = controllersWithHours.sort((a, b) => b.totalHours - a.totalHours).slice(0, 3);

    return (
        <Grid container columns={3} spacing={2} sx={{my: 1,}}>
            {top3Controllers.map((controller, idx) => (
                <Grid key={controller.user.cid} item xs={3} md={1}>
                    <Card>
                        <CardContent>
                            <Box sx={{mb: 2,}}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography
                                        variant="h5">{idx + 1} - {controller.user.preferredName || `${controller.user.firstName} ${controller.user.lastName}`}</Typography>
                                    <Tooltip title="View Statistics for this controller">
                                        <Link href={`/controllers/statistics/${controller.user.cid}`}>
                                            <IconButton size="large">
                                                <StackedLineChart fontSize="large"/>
                                            </IconButton>
                                        </Link>
                                    </Tooltip>
                                </Stack>
                                <Typography
                                    variant="subtitle2">{controller.user.preferredName && `${controller.user.firstName} ${controller.user.lastName}`}</Typography>
                                <Typography
                                    variant="body1">{getRating(controller.user.rating)} • {controller.user.cid}</Typography>
                            </Box>
                            <Typography variant="h6">{controller.totalHours.toPrecision(3)} hours</Typography>
                        </CardContent>
                    </Card>
                </Grid>))}
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{mb: 1,}}>Facility Statistics</Typography>
                        <StatisticsTable basePath="/controllers/statistics" logs={consolidatedLog}
                                         year={searchParams.year ? parseInt(searchParams.year) : year}/>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}