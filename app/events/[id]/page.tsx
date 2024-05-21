import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {
    Box, Button,
    Card,
    CardContent,
    Container,
    Grid,
    Stack,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow, Tooltip,
    Typography
} from "@mui/material";
import Image from "next/image";
import {UTApi} from "uploadthing/server";
import {format} from "date-fns";
import Markdown from "react-markdown";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import {getRating} from "@/lib/vatsim";
import {EventPosition} from "@prisma/client";
import {Add, Delete, Lock} from "@mui/icons-material";
import {is} from "effect/Match";
import {assignEventPosition} from "@/actions/eventPosition";
import EventPositionSignupButton from "@/components/EventPosition/EventPositionSignupButton";
import EventPositionSignupForm from "@/components/EventPosition/EventPositionSignupForm";

const ut = new UTApi();

export default async function Page({params}: { params: { id: string } }) {

    const {id} = params;

    const event = await prisma.event.findUnique({
        where: {
            id,
        },
        include: {
            positions: {
                include: {
                    controllers: true,
                },
            },
        },
    });

    if (!event) {
        notFound();
    }

    const urls = await ut.getFileUrls([event.bannerKey]);
    const imageUrl = urls.data[0].url || '';

    const isSignedUpForAnotherPosition = (currentPosition: EventPosition) => {
        return event.positions
            .filter((position) => position.id !== currentPosition.id)
            .map((position) => position.controllers)
            .flat()
            .map((controller) => controller.id)
            .includes(session?.user.id || '');
    }
    const session = await getServerSession(authOptions);

    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Grid container columns={2} spacing={2}>
                        <Grid item xs={2}>
                            <Box sx={{position: 'relative', width: '100%', minHeight: 400,}}>
                                <Image src={imageUrl} alt={event.name} priority fill style={{objectFit: 'contain'}}/>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Stack direction="column" spacing={1} sx={{mb: 4,}}>
                                <Typography variant="h5">{event.name}</Typography>
                                <Typography variant="subtitle1">
                                    {format(new Date(event.start), 'M/d/yy HHmm')}z
                                    - {format(new Date(event.end), 'M/d/yy HHmm')}z
                                </Typography>
                                <Typography variant="subtitle2">{event.featuredFields.join(" • ") || 'No fields'}</Typography>
                            </Stack>
                            <Markdown>{event.description}</Markdown>
                        </Grid>
                        { session && session.user &&
                            <Grid item xs={2}>
                                <Typography variant="h6">Event Positions</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Position</TableCell>
                                                <TableCell>Controllers</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {event.positions.map((position) => (
                                                <TableRow key={position.id}>
                                                    <TableCell>{position.position} {position.minRating && `(${getRating(position.minRating)}+)`}</TableCell>
                                                    <TableCell>
                                                        {position.controllers.length === 0 && "N/A"}
                                                        {position.controllers.map((controller) => (
                                                            <Typography key={controller.id}>
                                                                {controller.firstName} {controller.lastName} - {getRating(controller.rating)}
                                                            </Typography>
                                                        ))}
                                                    </TableCell>
                                                    <TableCell>
                                                        { event.positionsLocked &&
                                                            <Tooltip title="Positions are locked">
                                                                <Lock />
                                                            </Tooltip>
                                                        }
                                                        { !event.positionsLocked && !isSignedUpForAnotherPosition(position) && <EventPositionSignupForm user={session.user} event={event} position={position} controllers={position.controllers as User[]} /> }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        }
                    </Grid>
                </CardContent>
            </Card>

        </Container>
    );
}

