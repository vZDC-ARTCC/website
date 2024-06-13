import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Card, CardContent, Typography} from "@mui/material";
import TrainingSessionTable from "@/components/TrainingSession/TrainingSessionTable";

export default async function Page() {

    const session = await getServerSession(authOptions);

    return session && (
        <Card>
            <CardContent>
                <Typography variant="h6">Training Tickets</Typography>
                <Typography sx={{my: 1,}}>All times in GMT</Typography>
                <TrainingSessionTable onlyUser={session.user}/>
            </CardContent>
        </Card>
    );
}