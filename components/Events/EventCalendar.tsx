'use client';
import React from 'react';
import {Event, EventType} from '@prisma/client';
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import {useRouter} from "next/navigation";

export default function EventCalendar({events}: { events: Event[], }) {

    const router = useRouter();

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            timeZone="UTC"
            editable={false}
            events={events.map((event) => ({
                id: event.id,
                title: event.name,
                start: event.start,
                end: event.end,
                color: getEventColor(event.type),
            }))}
            eventClick={(info) => {
                router.push(`/events/${info.event.id}`);
            }}
            buttonText={{
                today: "Today"
            }}
        />
    );
}

const getEventColor = (eventType: EventType) => {
    switch (eventType) {
        case EventType.HOME:
            return 'red';
        case EventType.SUPPORT:
            return 'blue';
        case EventType.GROUP_FLIGHT:
            return 'green';
        case EventType.TRAINING:
            return 'orange';
        default:
            return 'gray';
    }
}