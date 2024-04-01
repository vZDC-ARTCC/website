import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import FeedbackTabs from "@/components/Feedback/FeedbackTabs";
import FeedbackTable from "@/components/Feedback/FeedbackTable";
import {FeedbackStatus} from "@prisma/client";

export default async function Page({searchParams}: { searchParams: { status: string, } }) {

    const status = searchParams.status || "PENDING";

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 1,}}>Feedback</Typography>
                <FeedbackTabs/>
                <FeedbackTable status={status as FeedbackStatus}/>
            </CardContent>
        </Card>
    );

}