import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import prisma from "@/lib/db";
import {getMonth, getTimeAgo} from "@/lib/date";
import {getMonthHours} from "@/lib/hours";

export default async function Page() {

    const membership = await prisma.user.findMany({
        where: {
            controllerStatus: {
                not: 'NONE'
            },
        },
    });
    const visitors = membership.filter((c) => c.controllerStatus === 'VISITOR');
    const trainingStaff = membership.filter((c) => c.roles.includes('INSTRUCTOR') || c.roles.includes('MENTOR'));
    const recentLogs = await prisma.log.findMany({
        take: 10,
        orderBy: {
            timestamp: 'desc'
        },
        include: {
            user: true
        },
    });

    const now = new Date();
    const monthHours = await getMonthHours(now.getMonth(), now.getFullYear());

    return (
        <Box>
            <Grid container columns={4} spacing={2}>
                <Grid item xs={4} md={2} lg={1}>
                    <Card>
                        <CardContent>
                            <Typography>Membership</Typography>
                            <Typography variant="h4">{membership.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} md={2} lg={1}>
                    <Card>
                        <CardContent>
                            <Typography>Visitors</Typography>
                            <Typography variant="h4">{visitors.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} md={2} lg={1}>
                    <Card>
                        <CardContent>
                            <Typography>Training Staff</Typography>
                            <Typography variant="h4">{trainingStaff.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} md={2} lg={1}>
                    <Card>
                        <CardContent>
                            <Typography>{getMonth(now.getMonth())} Hours</Typography>
                            <Typography variant="h4">{monthHours}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Recent Activity</Typography>
                            {recentLogs.length === 0 && <Typography sx={{mt: 1,}}>No recent activity</Typography>}
                            {recentLogs.length > 0 && <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Time</TableCell>
                                            <TableCell>User</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Model</TableCell>
                                            <TableCell>Message</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentLogs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>{getTimeAgo(log.timestamp)}</TableCell>
                                                <TableCell>{log.user.cid} ({log.user.fullName})</TableCell>
                                                <TableCell>{log.type}</TableCell>
                                                <TableCell>{log.model}</TableCell>
                                                <TableCell>{log.message}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>}

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}