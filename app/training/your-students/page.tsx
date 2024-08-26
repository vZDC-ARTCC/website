import React from 'react';
import {
    Card,
    CardContent, Chip, IconButton,
    Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import prisma from "@/lib/db";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import {getRating} from "@/lib/vatsim";
import Link from "next/link";
import {LocalActivity, MilitaryTech, People} from "@mui/icons-material";
import {Lesson} from "@prisma/client";
import {formatZuluDate, getTimeAgo} from "@/lib/date";

type Student = {
    user: User,
    trainingAssignmentId?: string,
    lastSession: {
        start: Date,
        id: string,
        tickets: {
            lesson: Lesson,
            passed: boolean,
        }[],
    } | undefined,
}

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error('User not authenticated');
    }

    const primaryStudentsData = await prisma.user.findMany({
        where: {
            trainingAssignmentStudent: {
                primaryTrainerId: session.user.id,
            },
        },
        include: {
            trainingAssignmentStudent: true,
            trainingSessions: {
                orderBy: {start: 'desc'},
                take: 1,
                include: {
                    tickets: {
                        include: {
                            lesson: true,
                        },
                    },
                },
            },
        },
    });

    const otherStudentsData = await prisma.user.findMany({
        where: {
            trainingAssignmentStudent: {
                otherTrainers: {
                    some: {
                        id: session.user.id,
                    },
                },
            },
        },
        include: {
            trainingAssignmentStudent: true,
            trainingSessions: {
                orderBy: {start: 'desc'},
                take: 1,
                include: {
                    tickets: {
                        include: {
                            lesson: true,
                        },
                    },
                },
            },
        },
    });

    const primaryStudents: Student[] = primaryStudentsData.map(student => ({
        user: student as User,
        trainingAssignmentId: student.trainingAssignmentStudent?.id,
        lastSession: student.trainingSessions[0] ? {
            start: student.trainingSessions[0].start,
            id: student.trainingSessions[0].id,
            tickets: student.trainingSessions[0].tickets.map(ticket => ({
                lesson: ticket.lesson,
                passed: ticket.passed,
            })),
        } : undefined,
    }));

    const otherStudents: Student[] = otherStudentsData.map(student => ({
        user: student as User,
        trainingAssignmentId: student.trainingAssignmentStudent?.id,
        lastSession: student.trainingSessions[0] ? {
            start: student.trainingSessions[0].start,
            id: student.trainingSessions[0].id,
            tickets: student.trainingSessions[0].tickets.map(ticket => ({
                lesson: ticket.lesson,
                passed: ticket.passed,
            })),
        } : undefined,
    }));

    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h5" sx={{mb: 1,}}>Primary Students</Typography>
                    {primaryStudents.length === 0 && <Typography>You have no primary students.</Typography>}
                    {primaryStudents.length > 0 && getTable(primaryStudents)}
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h5" sx={{mb: 1,}}>Other Students</Typography>
                    {otherStudents.length === 0 && <Typography>You have no other students.</Typography>}
                    {otherStudents.length > 0 && getTable(otherStudents)}
                </CardContent>
            </Card>
        </Stack>

    );
}

const getTable = (students: Student[]) => (
    <TableContainer>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Last Session Date</TableCell>
                    <TableCell>Last Session Lesson(s)</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {students.map(student => (<TableRow key={student.user.id}>
                    <TableCell>{student.user.fullName}</TableCell>
                    <TableCell>{getRating(student.user.rating)}</TableCell>
                    <TableCell>{student.lastSession ? <Tooltip
                        title={formatZuluDate(student.lastSession.start)}><>{getTimeAgo(student.lastSession.start)}</>
                    </Tooltip> : 'N/A'}</TableCell>
                    <TableCell>{student.lastSession ? student.lastSession.tickets.map((ticket) => <Chip size="small"
                                                                                                        label={ticket.lesson.name}
                                                                                                        color={ticket.passed ? 'success' : 'error'}/>) : 'N/A'}</TableCell>
                    <TableCell>
                        {student.lastSession ? (
                            <Tooltip title="View Last Training Session">
                                <Link href={`/training/sessions/${student.lastSession.id}`} target="_blank">
                                    <IconButton>
                                        <LocalActivity/>
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        ) : null}
                        <Tooltip title="View Certifications">
                            <Link href={`/training/controller/${student.user.cid}`} target="_blank">
                                <IconButton>
                                    <MilitaryTech/>
                                </IconButton>
                            </Link>
                        </Tooltip>
                        <Tooltip title="View Training Assignment">
                            <Link href={`/training/assignments/${student.trainingAssignmentId}`} target="_blank">
                                <IconButton>
                                    <People/>
                                </IconButton>
                            </Link>
                        </Tooltip>
                    </TableCell>
                </TableRow>))}
            </TableBody>
        </Table>
    </TableContainer>
);