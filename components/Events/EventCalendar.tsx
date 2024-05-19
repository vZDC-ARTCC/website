'use client';
import React from 'react';
import {Event} from '@prisma/client';
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";

export default function EventCalendar({events}: { events: Event[], }) {
    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            timeZone="UTC"
            editable={false}
            events={events.map((event) => ({
                title: event.name,
                start: event.start,
                end: event.end,
                url: `/events/${event.id}`,
                eventTextColor: "inherit"
            }))}
        />
    );
}