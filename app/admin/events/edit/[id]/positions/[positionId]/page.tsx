import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import Link from "next/link";
import {ArrowBack} from "@mui/icons-material";
import EventPositionForm from "@/components/EventPosition/EventPositionForm";

export default async function Page(props: { params: Promise<{ positionId: string, }> }) {
    const params = await props.params;

    const {positionId} = params;

    const eventPosition = await prisma.eventPosition.findUnique({
        where: {
            id: positionId,
        },
        include: {
            event: true,
        },
    });

    if (!eventPosition) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 2,}}>
                    <Link href={`/admin/events/edit/${eventPosition.event.id}/positions`} style={{color: 'inherit',}}>
                        <Tooltip title="Go Back">
                            <IconButton color="inherit">
                                <ArrowBack fontSize="large"/>
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Typography variant="h5">{eventPosition.position} - {eventPosition.event.name}</Typography>
                </Stack>
                <EventPositionForm event={eventPosition.event} eventPosition={eventPosition}/>
            </CardContent>
        </Card>
    );
}