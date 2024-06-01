import React from 'react';
import {Typography} from "@mui/material";
import TrainingSessionForm from "@/components/TrainingSession/TrainingSessionForm";

export default async function Page() {

    return (
        <>
            <Typography variant="h5" sx={{mb: 2,}}>New Training Session</Typography>
            <TrainingSessionForm/>
        </>
    );

}