'use client';
import React from 'react';
import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import {Info} from "@mui/icons-material";

export default function Error({error}: { error: Error }) {
    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography variant="h5">Staffing Request</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{mt: 2,}}>
                        <Info color="error"/>
                        <Typography>{error.message}</Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}