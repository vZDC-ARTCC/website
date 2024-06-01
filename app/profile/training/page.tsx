import React from 'react';
import TrainingSessionStudentTable from "@/components/TrainingSession/TrainingSessionStudentTable";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Card, CardContent, Typography} from "@mui/material";

export default async function Page() {

    const session = await getServerSession(authOptions);

    return session && (
        <Card>
            <CardContent>
                <Typography variant="h6">Training Tickets</Typography>
                <Typography sx={{my: 1,}}>All times in GMT</Typography>
                <TrainingSessionStudentTable user={session.user}/>
            </CardContent>
        </Card>
    );
}