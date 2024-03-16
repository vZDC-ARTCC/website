import React from 'react';
import {Button, Stack, Typography} from "@mui/material";
import Link from "next/link";
import {AirplanemodeActive} from "@mui/icons-material";

export default function NotFound() {
    return (
        <Stack direction="column" spacing={2} alignItems="center">
            <Typography variant="h4">Airport not found</Typography>
            <Typography>The airport you were looking for was not found. Try checking the ICAO code.</Typography>
            <Link href="/airports">
                <Button variant="contained" size="large" startIcon={<AirplanemodeActive/>}>Airports</Button>
            </Link>
        </Stack>
    );
}