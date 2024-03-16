import React from 'react';
import {getAirports} from "@/actions/airports";
import {Paper, Stack} from "@mui/material";
import IcaoForm from "@/components/Form/IcaoForm";
import AirportList from "@/components/Airports/AirportList";

export default async function Page({searchParams}: { searchParams: { icao?: string } }) {

    const {icao} = searchParams;

    const data = await getAirports(icao);

    return (
        <Stack direction="column" spacing={2}>
            <IcaoForm basePath="/airports"/>
            <Paper sx={{p: 2,}}>
                <AirportList airportGroups={data}/>
            </Paper>
        </Stack>
    );
}