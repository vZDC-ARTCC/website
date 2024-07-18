'use client'
import React from 'react';
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
import { BarChart } from '@mui/x-charts/BarChart';
import {User} from "@prisma/client";

export default function TrainingRecentLineChart({mentstructors}: {mentstructors: User}) {

    console.log(mentstructors.map((item)=>{
        return item.trainingSessionsGiven.length
    }))

    return (
        <BarChart
            xAxis={[{ scaleType: 'band', data: mentstructors.map((item)=>{return item.fullName}), tickPlacement: 'middle', tickLabelPlacement: 'middle' }]}
            series={[{ data: mentstructors.map((item)=>{return item.trainingSessionsGiven.length}) }]}
            width={500}
            height={300}
        />
    )
}
