import React from 'react';
import {Container, Stack, Typography} from "@mui/material";
import prisma from "@/lib/db";
import EventCalendar from "@/components/Events/EventCalendar";

export default async function Page() {

    const events = await prisma.event.findMany();

    return (
        <Container maxWidth="lg">
            <Stack direction="row" justifyContent="space-evenly" sx={{ mb: 2, }}>
                <Typography color="red" fontWeight="bold" sx={{ p: 1, border: 1, }}>Home</Typography>
                <Typography color="blue" fontWeight="bold" sx={{ p: 1, border: 1, }}>Supporting</Typography>
                <Typography color="green" fontWeight="bold" sx={{ p: 1, border: 1, }}>Group Flight</Typography>
                <Typography color="orange" fontWeight="bold" sx={{ p: 1, border: 1, }}>Training</Typography>
            </Stack>
            <EventCalendar events={events}/>
        </Container>

    );

}