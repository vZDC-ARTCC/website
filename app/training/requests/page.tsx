import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import TrainerAssignmentRequestsTable from "@/components/TrainerAssignmentRequest/TrainerAssignmentRequestsTable";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {permanentRedirect} from "next/navigation";

export default async function Page() {

    const session = await getServerSession(authOptions);

    const isInstructorOrStaff = session?.user?.roles.includes('INSTRUCTOR') || session?.user?.roles.includes('STAFF');

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 1,}}>Trainer Assignment Requests</Typography>
                <TrainerAssignmentRequestsTable isInstructorOrStaff={!!isInstructorOrStaff}/>
            </CardContent>
        </Card>
    );
}