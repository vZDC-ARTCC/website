import React from 'react';
import {
    Button,
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Link from "next/link";
import {Add} from "@mui/icons-material";
import prisma from "@/lib/db";

export default async function Page() {

    const events = await prisma.event.findMany({
        orderBy: {
            start: 'asc',
        },
    });

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Stack direction="column" spacing={1}>
                        <Typography variant="h5">Events</Typography>
                        <Typography>Events are automatically deleted one week from the end date</Typography>
                        <Typography>All times are in UTC</Typography>
                    </Stack>
                    <Link href="/admin/events/new">
                        <Button variant="contained" size="large" startIcon={<Add/>}>New Event</Button>
                    </Link>
                </Stack>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Start</TableCell>
                                <TableCell>End</TableCell>
                                <TableCell>External</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>{new Date(event.start).toISOString()}</TableCell>
                                    <TableCell>{new Date(event.end).toISOString()}</TableCell>
                                    <TableCell>{event.external ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        <Link href={`/admin/events/edit/${event.id}`}>
                                            <Button variant="contained" size="small">Edit</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );

}