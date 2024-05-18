import React from 'react';
import prisma from "@/lib/db";
import {getMonth} from "@/lib/date";
import {Box, Card, CardContent, Grid, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import Link from "next/link";
import {StackedLineChart} from "@mui/icons-material";
import {getRating} from "@/lib/vatsim";
import StatisticsTableNew from "@/components/Statistics/StatisticsTableNew";
import {getControllerLog, getTop3Controllers, getTotalHours} from "@/lib/hours";

export default async function Page({params}: { params: { year: string, month: string } }) {

    const {year, month} = params;

    if (!Number(year) || Number(year) < 2000 || Number(year) > new Date().getFullYear() || Number(month) < 0 || Number(month) > 11) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h4">Invalid Timeframe</Typography>
                    <Typography sx={{mt: 1,}}>Year must be after 2000 and not after this year. Month must also be within
                        0-11 range.</Typography>
                </CardContent>
            </Card>
        );
    }

    const logs = await prisma.controllerLogMonth.findMany({
        where: {
            year: parseInt(year),
            month: parseInt(month),
        },
        include: {
            log: {
                include: {
                    user: true
                }
            }
        }
    });

    const totalHours = getTotalHours(logs);

    const top3Controllers = getTop3Controllers(logs);

    const controllerLog = getControllerLog(logs);

    return (
        <Grid container columns={30} spacing={2}>
            <Grid item xs={30}>
                <Card>
                    <CardContent>
                        <Typography variant="h4">{getMonth(parseInt(month))}, {year} Statistics</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={30} sm={15} md={5}>
                <Card>
                    <CardContent>
                        <Typography>Delivery Hours</Typography>
                        <Typography variant="h6">{totalHours.deliveryHours.toPrecision(3)} hours</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={30} sm={15} md={5}>
                <Card>
                    <CardContent>
                        <Typography>Ground Hours</Typography>
                        <Typography variant="h6">{totalHours.groundHours.toPrecision(3)} hours</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={30} sm={15} md={5}>
                <Card>
                    <CardContent>
                        <Typography>Tower Hours</Typography>
                        <Typography variant="h6">{totalHours.towerHours.toPrecision(3)} hours</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={30} sm={15} md={5}>
                <Card>
                    <CardContent>
                        <Typography>TRACON Hours</Typography>
                        <Typography variant="h6">{totalHours.approachHours.toPrecision(3)} hours</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={30} sm={15} md={5}>
                <Card>
                    <CardContent>
                        <Typography>Center Hours</Typography>
                        <Typography variant="h6">{totalHours.centerHours.toPrecision(3)} hours</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={30} sm={15} md={5}>
                <Card>
                    <CardContent>
                        <Typography>Total Hours</Typography>
                        <Typography
                            variant="h6">{(totalHours.deliveryHours + totalHours.groundHours + totalHours.towerHours + totalHours.approachHours + totalHours.centerHours).toPrecision(3)} hours</Typography>
                    </CardContent>
                </Card>
            </Grid>
            {top3Controllers.map((controller, idx) => (
                <Grid key={controller.user.cid} item xs={30} md={10}>
                    <Card>
                        <CardContent>
                            <Box sx={{mb: 2,}}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography
                                        variant="h5">{idx + 1} - {controller.user.preferredName || `${controller.user.firstName} ${controller.user.lastName}`}</Typography>
                                    <Tooltip title="View Statistics for this controller">
                                        <Link href={`/controllers/statistics/${year}/${month}/${controller.user.cid}`}>
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
                            <Typography variant="h6">{controller.hours.toPrecision(3)} hours</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
            <Grid item xs={30}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Controller Totals</Typography>
                        <StatisticsTableNew heading="Controller" logs={controllerLog.filter((log) => !!log)}/>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}