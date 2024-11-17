import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Box, Button, Card, CardContent, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import Link from "next/link";
import {ArrowBack, Checklist} from "@mui/icons-material";
import EventForm from "@/components/Events/EventForm";
import {UTApi} from "uploadthing/server";
import EventPositionsLockButton from "@/components/EventPosition/EventPositionsLockButton";
import Placeholder from "../../../../../public/img/logo_large.png";

const ut = new UTApi();

export default async function Page(props: { params: Promise<{ id: string; }> }) {
    const params = await props.params;

    const { id } = params;

    const event = await prisma.event.findUnique({
        where: {
            id,
        },
    });

    if (!event) {
        notFound();
    }

    const urls = await ut.getFileUrls([event.bannerKey]);
    const imageUrl = ['png','jpeg','jpg','gif'].indexOf(urls.data[0]?.url.split('.').at(-1)!) > -1 ? urls.data[0]?.url : Placeholder;

    return (
        <Card>
            <CardContent>
                <Stack direction={{ xs: 'column', md: 'row', }} spacing={2} alignItems="center">
                    <Link href="/admin/events" style={{color: 'inherit',}}>
                        <Tooltip title="Go Back">
                            <IconButton color="inherit">
                                <ArrowBack fontSize="large"/>
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Typography variant="h5">Edit Event</Typography>
                    <Link href={`/admin/events/edit/${id}/positions`} style={{color: 'inherit',}}>
                        <Button variant="contained" startIcon={<Checklist/>}>Manage Positions</Button>
                    </Link>
                    <EventPositionsLockButton event={event}/>
                </Stack>
                <Box sx={{mt: 1,}}>
                    <EventForm event={event} imageUrl={imageUrl}/>
                </Box>
            </CardContent>
        </Card>
    );
}