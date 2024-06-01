import React from 'react';
import {Typography} from "@mui/material";
import TrainingSessionForm from "@/components/TrainingSession/TrainingSessionForm";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";

export default async function Page({params}: { params: { id: string } }) {

    const trainingSession = await prisma.trainingSession.findUnique({
        where: {
            id: params.id
        },
    });

    if (!trainingSession) {
        notFound();
    }

    return (
        <>
            <Typography variant="h5" sx={{mb: 2,}}>Edit Training Session</Typography>
            <TrainingSessionForm trainingSession={trainingSession}/>
        </>
    );

}