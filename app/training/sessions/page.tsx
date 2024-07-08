import React from 'react';
import {Button, Stack, Typography} from "@mui/material";
import Link from "next/link";
import {Add} from "@mui/icons-material";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import TrainingSessionTable from "@/components/TrainingSession/TrainingSessionTable";

export default async function Page() {

    const session = await getServerSession(authOptions);
    let isStaff, isInstructor = false;
    const mentorCID = session.user.cid;

    if (session.user.staffPositions !== undefined || session.user.staffPositions.length > 0){
        isStaff = true;
    }

    if (session.user.roles.includes("INSTRUCTOR")){
        isInstructor = true;
    }

    return (
        <>
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{mb: 2,}}>
                <Stack direction="column" spacing={1}>
                    <Typography variant="h5">Training Sessions</Typography>
                </Stack>
                    <Link href="/training/sessions/new">
                        <Button variant="contained" size="large" startIcon={<Add/>}>New Training Session</Button>
                    </Link>
            </Stack>
            <Typography sx={{my: 1,}}>All times in GMT</Typography>
            <TrainingSessionTable admin isStaff={isStaff} isInstructor={isInstructor} mentorCID={mentorCID}/>
        </>
    );

}