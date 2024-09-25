import React from 'react';
import {Typography} from "@mui/material";
import {Info} from "@mui/icons-material";

export default async function Page() {

    return (
        <Typography sx={{display: 'flex', gap: 1, alignItems: 'center',}}><Info color="info"/> Enter an ICAO code to get
            started</Typography>
    );
}