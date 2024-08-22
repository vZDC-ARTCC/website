import React from 'react';
import {Card, CardContent, Stack, Typography} from "@mui/material";
import prisma from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {permanentRedirect} from "next/navigation";
import {getRating} from "@/lib/vatsim";
import Link from "next/link";
import {OpenInNew} from "@mui/icons-material";

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session) {
        permanentRedirect('/');
    }

    const primaryStudents = await prisma.user.findMany({
        where: {
            trainingAssignmentStudent: {
                primaryTrainerId: session.user.id,
            },
        },
    });

    const otherStudents = await prisma.user.findMany({
        where: {
            trainingAssignmentStudent: {
                otherTrainers: {
                    some: {
                        id: session.user.id,
                    },
                },
            },
        },
    });

    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h5" sx={{mb: 1,}}>Primary Students</Typography>
                    <Stack direction="column" spacing={1}>
                        {primaryStudents.map(student => (
                            <Link key={student.id} href={`/training/history/${student.cid}`} target="_blank"
                                  style={{textDecoration: 'none', color: 'inherit'}}>
                                <Typography variant="h6">{student.firstName} {student.lastName} ({student.cid})
                                    - {getRating(student.rating)} <OpenInNew/></Typography>
                            </Link>
                        ))}
                    </Stack>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h5" sx={{mb: 1,}}>Other Students</Typography>
                    {otherStudents.map(student => (
                        <Link key={student.id} href={`/training/history/${student.cid}`} target="_blank"
                              style={{textDecoration: 'none', color: 'inherit'}}>
                            <Typography>{student.firstName} {student.lastName} ({student.cid})
                                - {getRating(student.rating)} <OpenInNew/></Typography>
                        </Link>
                    ))}
                </CardContent>
            </Card>
        </Stack>

    );
}