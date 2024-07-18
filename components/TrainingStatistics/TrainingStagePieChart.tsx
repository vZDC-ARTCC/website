'use client'
import React from 'react';
import prisma from "@/lib/db";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
    Switch,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import {TrainingSession} from "@prisma/client";

export default function TrainingStagePieChart({trainingSessions}: {trainingSessions: TrainingSession}) {

    let numStage1 = 0;
    let numStage2 = 0;
    let numStage3 = 0;
    trainingSessions.map((sessions)=>{
        switch (sessions.tickets[0].lesson.identifier.split("-")[0]){
            case "1":
                numStage1++;
                break;
            case "2":
                numStage2++;
                break;
            case "3":
                numStage3++;
                break;
        }

    })

    return (
        <PieChart
            series={[
            {
                data: [
                { id: 0, value: numStage1, label: 'Stage 1' },
                { id: 1, value: numStage2, label: 'Stage 2' },
                { id: 2, value: numStage3, label: 'Stage 3' },
                ],
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 270,
            },
            ]}
            width={500}
            height={300}
      />
    )
}
