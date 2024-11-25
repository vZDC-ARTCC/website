import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import TrainingProgressionForm from "@/components/TrainingProgression/TrainingProgressionForm";

export default async function Page({params}: { params: Promise<{ id: string }> }) {

    const {id} = await params;

    const trainingProgression = await prisma.trainingProgression.findUnique({
        where: {
            id,
        }
    });

    if (!trainingProgression) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Edit Training Progression</Typography>
                <TrainingProgressionForm trainingProgression={trainingProgression}/>
            </CardContent>
        </Card>
    );
}