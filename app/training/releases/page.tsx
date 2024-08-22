import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import TrainerReleaseRequestTable from "@/components/TrainerReleaseRequest/TrainerReleaseRequestTable";

export default async function Page() {

    const session = await getServerSession(authOptions);
    const isInstructorOrStaff = session?.user?.roles.includes('INSTRUCTOR') || session?.user?.roles.includes('STAFF');

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Trainer Release Requests</Typography>
                <TrainerReleaseRequestTable isInstructorOrStaff={!!isInstructorOrStaff}/>
            </CardContent>
        </Card>
    );
}