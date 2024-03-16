import React from 'react';
import {Grid, Paper, Stack, Typography} from "@mui/material";
import {getAirport} from "@/actions/airports";
import {notFound} from "next/navigation";
import ChartsList from "@/components/Charts/ChartsList";
import {fetchCharts} from "@/actions/charts";
import AirportRunwayInformation from "@/components/Airports/AirportRunwayInformation";

export default async function Page({params}: { params: { icao: string, } }) {

    const {icao} = params;

    const airport = await getAirport(icao);

    if (!airport) {
        notFound();
    }

    const charts = await fetchCharts(icao);

    return (
        <Stack direction="column" spacing={2}>
            <Typography variant="h5" fontWeight={700} textAlign="center">{airport.name} ({airport.iata})</Typography>
            <Grid container spacing={2} columns={2}>
                <Grid item xs={2} md={1}>
                    <Paper sx={{padding: 2,}}>
                        <ChartsList icao={airport.icao} charts={charts}/>
                    </Paper>
                </Grid>
                <Grid item xs={2} md={1}>
                    <Paper sx={{padding: 2,}}>
                        <AirportRunwayInformation airport={airport}/>
                    </Paper>
                </Grid>
            </Grid>
        </Stack>

    );
}