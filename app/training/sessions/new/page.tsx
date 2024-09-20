import React from 'react';
import {Typography} from "@mui/material";
import TrainingSessionForm from "@/components/TrainingSession/TrainingSessionForm";
import ZuluTime from '@/components/TrainingSession/TrainingTicketZuluClock';

export default async function Page() {

    return (
        <>
            <div style={{display:"flex"}}>
                <Typography variant="h5" sx={{mb: 2,}}>New Training Session</Typography>
                <ZuluTime/>
            </div>
            <TrainingSessionForm/>
        </>
    );

}