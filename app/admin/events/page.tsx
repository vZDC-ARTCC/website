import React from 'react';
import {
    Button,
    Card,
    CardContent, IconButton,
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
import {Add, Edit, OpenInNew} from "@mui/icons-material";
import prisma from "@/lib/db";
import CertificationTypeDeleteButton from "@/components/CertificationTypes/CertificationTypeDeleteButton";
import EventDeleteButton from "@/components/Events/EventDeleteButton";

const VATUSA_FACILITY = process.env.VATUSA_FACILITY;

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
                        <Typography>All times are in GMT</Typography>
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
                                <TableCell>Banner</TableCell>
                                <TableCell>Host</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>{new Date(event.start).toUTCString()}</TableCell>
                                    <TableCell>{new Date(event.end).toUTCString()}</TableCell>
                                    <TableCell>
                                        <Link href={event.bannerUrl || ''}>
                                            <IconButton>
                                                <OpenInNew />
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                    <TableCell>{event.external ? event.host : <Typography fontWeight="bold">{VATUSA_FACILITY}</Typography>}</TableCell>
                                    <TableCell>
                                        <Link href={`/admin/events/edit/${event.id}`}
                                              style={{color: 'inherit',}}>
                                            <IconButton>
                                                <Edit/>
                                            </IconButton>
                                        </Link>
                                        <EventDeleteButton event={event} />
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