import React from 'react';
import {
    Card,
    CardContent,
    Grid, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {getMonth, getTimeAgo} from "@/lib/date";
import prisma from "@/lib/db";
import {TRAINING_ONLY_LOG_MODELS} from "@/lib/log";
import {Info} from "@mui/icons-material";
import TrainingStagePieChart from '@/components/TrainingStatistics/TrainingStagePieChart';
import TrainingRecentLineChart from '@/components/TrainingStatistics/TrainingRecentLineChart';
import TrainingByMentor from '@/components/TrainingStatistics/TrainingByMentor';

export default async function Page() {

    const trainingSessions = await prisma.trainingSession.findMany({
       where: {
            start: {
                gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                lte: new Date(),
            }
       },
       include : {
            tickets: {
                include: {
                    lesson: true,
                }
            }
       }
    });

    const now = new Date();
    const users = await prisma.user.findMany({
        include: {
            trainingSessionsGiven: {
                where: {
                    start: {
                        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                        lte: new Date(),
                    }
                }
            },
            trainingSessions: {
                include: {
                    tickets: true
                }
            },
        }
    });

    const mentors = users.filter(user => user.roles.includes('MENTOR'));
    const instructors = users.filter(user => user.roles.includes('INSTRUCTOR'));

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const sessions = await prisma.trainingSession.findMany({
        where: {
            start: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        }
    });

    const totalHours = sessions.reduce((sum, session) => {
        const duration = (session.end.getTime() - session.start.getTime()) / (1000 * 60 * 60); // convert milliseconds to hours
        return sum + duration;
    }, 0).toPrecision(3);

    const recentLogs = await prisma.log.findMany({
        take: 10,
        where: {
            model: {
                in: TRAINING_ONLY_LOG_MODELS,
            }
        },
        orderBy: {
            timestamp: 'desc'
        },
        include: {
            user: true
        },
    });

    return (
        <Grid container columns={4} spacing={2}>
            <Grid item xs={4} md={2} lg={1}>
                <Card>
                    <CardContent>
                        <Typography>Mentors</Typography>
                        <Typography variant="h4">{mentors.length}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4} md={2} lg={1}>
                <Card>
                    <CardContent>
                        <Typography>Instructors</Typography>
                        <Typography variant="h4">{instructors.length}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4} md={2} lg={1}>
                <Card>
                    <CardContent>
                        <Typography>{getMonth(now.getMonth())} Sessions</Typography>
                        <Typography variant="h4">{sessions.length}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4} md={2} lg={1}>
                <Card>
                    <CardContent>
                        <Typography>{getMonth(now.getMonth())} Training Hours</Typography>
                        <Typography variant="h4">{totalHours}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={2}>
                <Card>
                    <CardContent>
                        <Stack spacing={1} alignItems="center">
                            <Typography variant="h5">Sessions in the Last 30 Days</Typography>
                            <TrainingRecentLineChart trainingSessions={trainingSessions}/>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={2}>
                <Card>
                    <CardContent>
                        <Stack spacing={1} alignItems="center">
                            <Typography variant="h5">Stages Taught in the Last 30 Days</Typography>
                            <TrainingStagePieChart trainingSessions={trainingSessions}/>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h5"> INS/MTR Activity</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TrainingByMentor mentstructors={mentors.concat(instructors)}/>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}