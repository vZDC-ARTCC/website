import React from 'react';
import {Card, CardContent, Stack, Typography} from "@mui/material";
import {Info} from "@mui/icons-material";

export default async function Page() {

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Info color="info"/>
            <Typography>Enter a CID to fetch controller.</Typography>
        </Stack>
    );

}