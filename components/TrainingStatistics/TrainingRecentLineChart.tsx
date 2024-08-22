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
import { LineChart } from '@mui/x-charts/LineChart';
import {TrainingSession} from "@prisma/client";

export default function TrainingRecentLineChart({trainingSessions}: {trainingSessions: TrainingSession}) {


    const sessionsPerDay = [];
    const getDaysArray = function(start: Date, end: Date) {
        const arr = [];
        for(const dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
            arr.push(new Date(dt));
            sessionsPerDay.push(0);
        }
        return arr;
    };

    const daylist = getDaysArray(new Date(new Date().setDate(new Date().getDate() - 30)).toDateString(),new Date().toDateString());
    // console.log(daylist[daylist.length-1])
    const count = {};
    let trainingDates = [];

    trainingSessions.map((sessions)=>{
        trainingDates.push(new Date(sessions.end.toDateString()))
    })

    for (let i = 0; i < trainingDates.length; i++) {
        let ele = trainingDates[i];
        if (count[ele]) {
            count[ele] += 1;
        } else {
            count[ele] = 1;
        }
    }

    Object.keys(count).map((item)=>{
        const idx = daylist.map(Number).indexOf(+new Date(item));
        sessionsPerDay[idx] = count[item];
    })

    // console.log(sessionsPerDay)
    // console.log(Object.keys(count).map((item)=>{
    //     const idx = daylist.map(Number).indexOf(+new Date(item));
    //     sessionsPerDay[idx] = count[item];
    // }))

    return (
        <LineChart
            xAxis={[{ 
                id: 'Date',
                data: daylist,
                scaleType: 'time',
                min: daylist[0],
                max: daylist[daylist.length-1],
            }]}
            series={[
            {
                data: sessionsPerDay,
            },
            ]}
            width={500}
            height={300}
            grid={{ vertical: true, horizontal: true }}
        />
    )
}
