import React from 'react';
import {Paper} from "@mui/material";
import ChartsList from "@/components/Charts/ChartsList";
import {Chart} from "@/types";
import {fetchCharts} from "@/actions/charts";

export default async function Page({params}: { params: { icao: string, } }) {

    const {icao} = params;

    const charts: Chart[] = [];

    if (icao) {
        charts.push(...await fetchCharts(icao));
    }

    return (
        <Paper sx={{p: 2, width: '100%',}}>
            <ChartsList icao={icao} charts={charts}/>
        </Paper>
    );
}