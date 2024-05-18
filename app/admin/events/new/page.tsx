import React from 'react';
import {Box, Card, CardContent, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import Link from "next/link";
import {ArrowBack} from "@mui/icons-material";
import EventForm from "@/components/Events/EventForm";

export default function Page() {

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Link href="/admin/events" style={{color: 'inherit',}}>
                        <Tooltip title="Go Back">
                            <IconButton color="inherit">
                                <ArrowBack fontSize="large"/>
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Typography variant="h5">New Event</Typography>
                </Stack>
                <Box sx={{mt: 1,}}>
                    <EventForm/>
                </Box>
            </CardContent>
        </Card>
    );
}
