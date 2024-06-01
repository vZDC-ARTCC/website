import React from 'react';
import {User} from "next-auth";
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import prisma from "@/lib/db";
import {formatZuluDate} from "@/lib/date";
import EventPositionSignupForm from "@/components/EventPosition/EventPositionSignupForm";
import {Lock} from "@mui/icons-material";

export default async function EventSignupCard({user}: { user: User, }) {

    const eventSignups = await prisma.eventPosition.findMany({
        where: {
            controllers: {
                some: {
                    id: user.id,
                },
            },
        },
        include: {
            event: true,
            controllers: true,
        },
        orderBy: {
            event: {
                start: 'desc',
            },
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{mb: 1,}}>Event Signups</Typography>
                {eventSignups.length === 0 && <Typography>You are not signed up for any events.</Typography>}
                {eventSignups.length > 0 && <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Event Name</TableCell>
                                <TableCell>Position</TableCell>
                                <TableCell>Start</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {eventSignups.map((eventSignup) => (
                                <TableRow key={eventSignup.id}>
                                    <TableCell>{eventSignup.event.name}</TableCell>
                                    <TableCell>{eventSignup.position}</TableCell>
                                    <TableCell>{formatZuluDate(eventSignup.event.start)}</TableCell>
                                    <TableCell>
                                        {eventSignup.event.positionsLocked ? <Lock/> :
                                            <EventPositionSignupForm user={user} event={eventSignup.event}
                                                                     position={eventSignup}
                                                                     controllers={eventSignup.controllers as User[]}/>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </CardContent>
        </Card>
    );
}