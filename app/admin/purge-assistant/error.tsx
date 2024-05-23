'use client';
import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";

function Error({error}: { error: Error, }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Roster Purge Assistant</Typography>
                <Typography>{error.message}</Typography>
            </CardContent>
        </Card>
    );
}

export default Error;