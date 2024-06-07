'use client'
import React from 'react';
import {Event} from "@prisma/client";
import Carousel from "react-material-ui-carousel";
import {Box, Typography} from "@mui/material";
import Image from "next/image";
import {formatZuluDate} from "@/lib/date";

export default function UpcomingEventsCarousel({events, imageUrls}: {
    events: Event[],
    imageUrls: { [key: string]: string },
}) {
    return (
        <Carousel
            autoPlay
            animation="slide"
            fullHeightHover
        >
            {events.map(event => (
                <Box key={event.id} sx={{width: '100%', maxHeight: 300,}}>
                    <Image priority src={imageUrls[event.id]} alt={event.name} fill style={{objectFit: 'contain'}}/>
                    <Typography variant="h6" sx={{mt: 1,}}>{event.name}</Typography>
                    <Typography variant="subtitle2">{formatZuluDate(event.start)}</Typography>
                </Box>
            ))}
        </Carousel>
    );

}