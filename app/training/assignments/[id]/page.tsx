import React from 'react';
import {notFound, permanentRedirect} from "next/navigation";
import prisma from "@/lib/db";
import {Card, CardContent, Stack, Typography} from "@mui/material";
import TrainingAssignmentForm from "@/components/TrainingAssignment/TrainingAssignmentForm";
import {getServerSession, User} from "next-auth";
import TrainingAssignmentDeleteButton from "@/components/TrainingAssignment/TrainingAssignmentDeleteButton";
import {authOptions} from "@/auth/auth";

export default async function Page({params}: { params: { id: string, } }) {

    const {id} = params;

    const session = await getServerSession(authOptions);

    if (!session || (!session.user.staffPositions.includes("TA") && !session.user.staffPositions.includes("ATA"))) {
        permanentRedirect('/training/assignments');
    }

    const assignment = await prisma.trainingAssignment.findUnique({
        where: {
            id,
        },
        include: {
            student: true,
            primaryTrainer: true,
            otherTrainers: true,
        },
    });

    if (!assignment) {
        notFound();
    }

    const allUsers = await prisma.user.findMany({
        where: {
            controllerStatus: {
                not: 'NONE',
            },
        },
    });

    return (
        <Card>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Typography variant="h5">Training Assignment</Typography>
                    <TrainingAssignmentDeleteButton assignment={assignment} noTable/>
                </Stack>
                <Typography variant="subtitle2"
                            sx={{mb: 2,}}>{assignment.student.fullName} ({assignment.student.cid})</Typography>
                <TrainingAssignmentForm allUsers={allUsers as User[]} requestStudent={assignment.student as User}
                                        trainingAssignment={assignment}
                                        otherTrainerIds={assignment.otherTrainers.map(ot => ot.id)}/>
            </CardContent>
        </Card>
    );
}