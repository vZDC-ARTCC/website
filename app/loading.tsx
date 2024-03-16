import React from 'react';
import {CircularProgress, Container, Stack} from "@mui/material";

export default function Loading() {
    return (
        <Stack direction="row" justifyContent="center">
            <CircularProgress size={80}/>
        </Stack>
    );
}