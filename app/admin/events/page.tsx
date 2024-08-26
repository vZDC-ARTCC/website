import React from 'react';
import {
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import Link from "next/link";
import {Add, Checklist, Edit} from "@mui/icons-material";
import prisma from "@/lib/db";
import EventDeleteButton from "@/components/Events/EventDeleteButton";
import {format} from "date-fns";
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