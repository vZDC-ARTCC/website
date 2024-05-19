import React from 'react';
import {Container} from "@mui/material";
import prisma from "@/lib/db";
import EventCalendar from "@/components/Events/EventCalendar";

export default async function Page() {

    const events = await prisma.event.findMany();

    return (
        <Container maxWidth="xl">
            <EventCalendar events={events}/>
        </Container>

    );

}