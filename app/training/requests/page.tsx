import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import TrainerAssignmentRequestsTable from "@/components/TrainerAssignmentRequest/TrainerAssignmentRequestsTable";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";

export default async function Page() {

    const session = await getServerSession(authOptions);

    const isTaOrAta = session?.user?.staffPositions.includes('TA') || session?.user?.staffPositions.includes('ATA');

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 1,}}>Trainer Assignment Requests</Typography>
                <TrainerAssignmentRequestsTable manageMode={!!isTaOrAta}/>
            </CardContent>
        </Card>
    );
}