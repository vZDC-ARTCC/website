import React from 'react';
import {Box, Card, CardContent, Container, Stack, Typography} from "@mui/material";
import prisma from "@/lib/db";
import EventCalendar from "@/components/Events/EventCalendar";
import {formatZuluDate} from "@/lib/date";
import Image from "next/image";
import {UTApi} from "uploadthing/server";
import Link from "next/link";
import {Metadata} from "next";
import Placeholder from "../../public/img/logo_large.png";

const ut = new UTApi();
const VATUSA_FACILITY = process.env.VATUSA_FACILITY;
export const metadata: Metadata = {
    title: 'Events | vZDC',
    description: 'vZDC charts page',
};

export default async function Page() {

    const events = await prisma.event.findMany({
        orderBy: {
            start: 'asc',
        },
    });

    return (
        <Container maxWidth="lg">
            <Card sx={{mb: 2,}}>
                <CardContent>
                    <Typography variant="h6">Legend</Typography>
                    <Stack direction="column" spacing={2} sx={{mt: 1,}}>
                        <Typography color="#f44336" fontWeight="bold" sx={{p: 1, border: 1,}}>Home</Typography>
                        <Typography color="#cd8dd8" fontWeight="bold"
                                    sx={{p: 1, border: 1,}}>Support/Optional</Typography>
                        <Typography color="#834091" fontWeight="bold"
                                    sx={{p: 1, border: 1,}}>Support/Required</Typography>
                        <Typography color="#66bb6a" fontWeight="bold" sx={{p: 1, border: 1,}}>Group Flight</Typography>
                        <Typography color="#ffa726" fontWeight="bold" sx={{p: 1, border: 1,}}>Training</Typography>
                    </Stack>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <EventCalendar events={events}/>
                </CardContent>
            </Card>
            {events.length > 0 && <Typography variant="h6" sx={{my: 2,}}>List View</Typography>}
            <Stack direction="column" spacing={2}>
                {events.slice(0, 10).map(async (event) => (
                    <Card key={event.id}>
                        <CardContent>
                            <Link href={`/events/${event.id}`} style={{color: 'inherit', textDecoration: 'none',}}>
                                <Box sx={{position: 'relative', width: '100%', minHeight: 200,}}>
                                    <Image src={['png','jpeg','jpg','gif'].indexOf((await ut.getFileUrls([event.bannerKey])).data[0].url.split('.').at(-1)!) > -1?(await ut.getFileUrls([event.bannerKey])).data[0].url:Placeholder}
                                           alt={event.name} fill style={{objectFit: 'contain'}}/>
                                </Box>
                            </Link>
                            <Typography variant="h5">{event.name}</Typography>
                            <Typography
                                variant="subtitle2">{formatZuluDate(event.start)} - {formatZuluDate(event.end).substring(9)}</Typography>
                            <Typography variant="subtitle2">Hosted by {event.host || VATUSA_FACILITY}</Typography>
                            <Typography variant="subtitle2">{event.featuredFields.join(', ')}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Container>

    );

}