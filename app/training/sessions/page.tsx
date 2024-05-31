import React from 'react';
import {
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import TrainingSessionSearch from "@/components/TrainingSession/TrainingSessionSearch";
import prisma from "@/lib/db";
import Link from "next/link";
import {Add, Edit, Visibility} from "@mui/icons-material";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import TrainingSessionDeleteButton from "@/components/TrainingSession/TrainingSessionDeleteButton";

export default async function Page({searchParams}: { searchParams: { student?: string, trainer?: string, } }) {

    const {student, trainer} = searchParams;

    const trainingSessions = await prisma.trainingSession.findMany({
        where: {
            OR: [
                {
                    student: {
                        OR: [
                            {
                                cid: {
                                    contains: student || '',
                                    mode: 'insensitive',
                                }
                            },
                            {
                                firstName: {
                                    contains: student || '',
                                    mode: 'insensitive',
                                }
                            },
                            {
                                lastName: {
                                    contains: student || '',
                                    mode: 'insensitive',
                                }
                            },
                        ],
                    },
                    instructor: {
                        OR: [
                            {
                                cid: {
                                    contains: trainer || '',
                                    mode: 'insensitive',
                                }
                            },
                            {
                                firstName: {
                                    contains: trainer || '',
                                    mode: 'insensitive',
                                }
                            },
                            {
                                lastName: {
                                    contains: trainer || '',
                                    mode: 'insensitive',
                                }
                            },
                        ],
                    },
                }
            ]
        },
        include: {
            tickets: {
                include: {
                    lesson: true,
                    mistakes: true,
                }
            },
            student: true,
            instructor: true,
        },
        orderBy: {
            start: 'desc',
        },
    });

    const session = await getServerSession(authOptions);

    const getDuration = (start: Date, end: Date) => {
        const diff = end.getTime() - start.getTime();
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor(diff / 1000 / 60 % 60);
        return `${hours}h ${minutes}m`;
    }

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} justifyContent="space-between" sx={{mb: 2,}}>
                    <Stack direction="column" spacing={1}>
                        <Typography variant="h5">Training Sessions</Typography>
                    </Stack>
                    {session?.user.roles.includes("STAFF") &&
                        <Link href="/training/sessions/new">
                            <Button variant="contained" size="large" startIcon={<Add/>}>New Training Session</Button>
                        </Link>
                    }
                </Stack>
                <TrainingSessionSearch student={searchParams.student} trainer={searchParams.trainer}/>
                <Typography sx={{my: 1,}}>All times in GMT</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student</TableCell>
                                <TableCell>Trainer</TableCell>
                                <TableCell>Start</TableCell>
                                <TableCell>End</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Lessons</TableCell>
                                <TableCell>Mistakes</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {trainingSessions.map((trainingSession) => (
                                <TableRow key={trainingSession.id}>
                                    <TableCell>{trainingSession.student.firstName} {trainingSession.student.lastName} ({trainingSession.student.cid})</TableCell>
                                    <TableCell>{trainingSession.instructor.firstName} {trainingSession.instructor.lastName} ({trainingSession.instructor.cid})</TableCell>
                                    <TableCell>{trainingSession.start.toUTCString()}</TableCell>
                                    <TableCell>{trainingSession.end.toUTCString()}</TableCell>
                                    <TableCell>{getDuration(trainingSession.start, trainingSession.end)}</TableCell>
                                    <TableCell>{trainingSession.tickets.map((tt) => tt.lesson).map((l) => l.identifier).join(', ')}</TableCell>
                                    <TableCell>{trainingSession.tickets.reduce((acc, ticket) => acc + ticket.mistakes.length, 0)}</TableCell>
                                    <TableCell>
                                        <Link href={`/training/sessions/${trainingSession.id}`} passHref>
                                            <IconButton size="small">
                                                <Visibility/>
                                            </IconButton>
                                        </Link>
                                        <Link href={`/training/sessions/${trainingSession.id}/edit`} passHref>
                                            <IconButton size="small">
                                                <Edit/>
                                            </IconButton>
                                        </Link>
                                        {session?.user.roles.includes("STAFF") &&
                                            <TrainingSessionDeleteButton trainingSession={trainingSession}/>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );

}