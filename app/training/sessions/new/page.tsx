import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import TrainingSessionForm from "@/components/TrainingSession/TrainingSessionForm";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>New Training Session</Typography>
                <TrainingSessionForm/>
            </CardContent>
        </Card>
    );

}