import React from 'react';
import {User} from "next-auth";
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import prisma from "@/lib/db";
import Link from "next/link";
import {KeyboardArrowRight} from "@mui/icons-material";
import TrainingSessionStudentTable from "@/components/TrainingSession/TrainingSessionStudentTable";

export default async function TrainingCard({user}: { user: User, }) {

    const numSessions = await prisma.trainingSession.count({
        where: {
            student: {
                id: user.id,
            },
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Training Tickets</Typography>
                <Typography sx={{my: 1,}}>All times in GMT</Typography>
                <TrainingSessionStudentTable user={user} take={5}/>
                {numSessions > 5 && <Stack direction="row" justifyContent="flex-end" sx={{mt: 1,}}>
                    <Link href="/profile/training" style={{color: 'inherit', textDecoration: 'none',}}>
                        <Button color="inherit" endIcon={<KeyboardArrowRight/>}>View all Training</Button>
                    </Link>
                </Stack>}
            </CardContent>
        </Card>
    )

}