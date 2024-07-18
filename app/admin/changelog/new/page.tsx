import React from 'react';
import {Typography, Card, CardContent} from "@mui/material";
import ZuluTime from '@/components/TrainingSession/TrainingTicketZuluClock';
import ChangeLogForm from "@/components/Changelog/ChangeLogForm";


export default async function Page() {

    return (
        <>
            <div style={{display:"flex"}}>
                <Typography variant="h5" sx={{mb: 2,}}>New Changelog Version</Typography>
                <ZuluTime/>
            </div>
            <ChangeLogForm/>
        </>
    );

}