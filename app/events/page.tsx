'use client';
import React from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {EventSourceInput} from "@fullcalendar/core";
import {Container} from "@mui/material";

const events: EventSourceInput = [
    {
        title: 'ATL all day',
        start: new Date(2024, 4, 17, 3),
        end: new Date(2024, 4, 18, 4),
        color: 'green',
    },
];

export default function Page() {

    return (
        <Container maxWidth="xl">
            <FullCalendar
                plugins={[dayGridPlugin]}
                timeZone="UTC"
                editable={false}
                events={events}
            />
        </Container>

    );

}