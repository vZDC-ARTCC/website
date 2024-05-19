import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Box, Card, CardContent, Container, Grid, Stack, Typography} from "@mui/material";
import Image from "next/image";
import {UTApi} from "uploadthing/server";
import {format} from "date-fns";
import Markdown from "react-markdown";

const ut = new UTApi();

export default async function Page({params}: { params: { id: string } }) {

    const {id} = params;

    const event = await prisma.event.findUnique({
        where: {
            id,
        },
    });

    if (!event) {
        notFound();
    }

    const urls = await ut.getFileUrls([event.bannerKey]);
    const imageUrl = urls.data[0].url || '';

    return (
        <Container maxWidth="lg">
            <Card>
                <CardContent>
                    <Grid container columns={2} spacing={2}>
                        <Grid item xs={2}>
                            <Box sx={{position: 'relative', width: '100%', minHeight: 400,}}>
                                <Image src={imageUrl} alt={event.name} fill style={{objectFit: 'contain'}}/>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Stack direction="column" spacing={1} sx={{mb: 4,}}>
                                <Typography variant="h5">{event.name}</Typography>
                                <Typography variant="subtitle1">
                                    {format(new Date(event.start), 'M/d/yy HHmm')}z
                                    - {format(new Date(event.end), 'M/d/yy HHmm')}z
                                </Typography>
                                <Typography variant="subtitle2">{event.featuredFields.join(" • ")}</Typography>
                            </Stack>
                            <Markdown>{event.description}</Markdown>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </Container>
    );
}