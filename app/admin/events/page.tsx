import React from 'react';
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import Link from "next/link";
import {Add} from "@mui/icons-material";
import {deleteStaleEvents} from "@/actions/event";
import EventTable from "@/components/Events/EventTable";

export default async function Page() {

    await deleteStaleEvents();

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Stack direction="column" spacing={1}>
                        <Typography variant="h5">Events</Typography>
                        <Typography>Events are automatically deleted one week from the end date</Typography>
                    </Stack>
                    <Link href="/admin/events/new">
                        <Button variant="contained" size="large" startIcon={<Add/>}>New Event</Button>
                    </Link>
                </Stack>
                <EventTable/>
            </CardContent>
        </Card>
    );

}