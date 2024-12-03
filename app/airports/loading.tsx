import React from 'react';
import {Container, Skeleton, Stack} from "@mui/material";

export default function Loading() {
    return (
        <Container maxWidth="lg">
            <Stack direction="column" spacing={2}>
                <Skeleton variant="rectangular" height={200}/>
                <Skeleton variant="rectangular" height={200}/>
                <Skeleton variant="rectangular" height={200}/>
                <Skeleton variant="rectangular" height={200}/>
                <Skeleton variant="rectangular" height={200}/>
            </Stack>
        </Container>
    );
}