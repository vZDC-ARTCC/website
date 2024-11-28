import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {ArrowDownward, Circle, Done} from "@mui/icons-material";
import {TrainingProgressionStepWithLesson} from "@/components/TrainingProgressionStep/TrainingProgressionStepForm";

export default async function Page({params}: { params: Promise<{ id: string }> }) {

    const {id} = await params;

    const trainingProgression = await prisma.trainingProgression.findUnique({
        where: {
            id,
        },
        include: {
            steps: {
                include: {
                    lesson: true,
                },
                orderBy: {
                    order: 'asc',
                },
            },
        },
    });

    if (!trainingProgression) {
        notFound();
    }

    const endStep = getLastRequiredStep(trainingProgression.steps);

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>{trainingProgression.name}</Typography>
                <List>
                    {trainingProgression.steps.map((step) => (
                        <ListItem key={step.id}>
                            <ListItemIcon>
                                {step.id === endStep?.id ? <Done/> : (step.optional ? <Circle/> : <ArrowDownward/>)}
                            </ListItemIcon>
                            <ListItemText primary={`${step.lesson.identifier} - ${step.lesson.name}`}/>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}

const getLastRequiredStep = (steps: TrainingProgressionStepWithLesson[]) => {
    return steps.reduce((lastRequiredStep: TrainingProgressionStepWithLesson | null, step) => {
        if (!step.optional) {
            return step;
        }
        return lastRequiredStep;
    }, null);
}