import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {
    Box,
    Card,
    CardContent,
    Container,
    Grid2,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
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
import {Lock} from "@mui/icons-material";
import EventPositionSignupForm from "@/components/EventPosition/EventPositionSignupForm";
import Placeholder from "../../../public/img/logo_large.png";

const ut = new UTApi();

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

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
        (<Container maxWidth="md">
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <Grid2 container columns={2} spacing={2}>
                            <Grid2 size={2}>
                                <Box sx={{position: 'relative', width: '100%', minHeight: 400,}}>
                                    <Image
                                        src={['png', 'jpeg', 'jpg', 'gif'].indexOf(imageUrl.split('.').at(-1)!) > -1 ? imageUrl : Placeholder}
                                        alt={event.name} priority fill style={{objectFit: 'contain'}}/>
                                </Box>
                            </Grid2>
                            <Grid2 size={2}>
                                <Stack direction="column" spacing={1} sx={{mb: 4,}}>
                                    <Typography variant="h5">{event.name}</Typography>
                                    <Typography variant="subtitle1">
                                        {format(new Date(event.start), 'M/d/yy HHmm')}z
                                        - {format(new Date(event.end), 'M/d/yy HHmm')}z
                                    </Typography>
                                    <Typography
                                        variant="subtitle2">{event.featuredFields.join(" • ") || 'No fields'}</Typography>
                                </Stack>
                                <Markdown>{event.description}</Markdown>
                            </Grid2>
                        </Grid2>
                    </CardContent>
                </Card>
                {session && session.user &&
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{mb: 1,}}>Event Positions</Typography>
                            {event.positions.length === 0 && <Typography>No positions available</Typography>}
                            {event.positions.length > 0 && <TableContainer>
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
                                                <TableCell>{position.position} {position.minRating && `(${getRating(position.minRating) || getRating(2)}+)`}</TableCell>
                                                <TableCell>
                                                    {position.controllers.length === 0 && "N/A"}
                                                    {position.controllers.map((controller) => (
                                                        <Typography key={controller.id}>
                                                            {controller.firstName} {controller.lastName} - {getRating(controller.rating)}
                                                        </Typography>
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    {event.positionsLocked &&
                                                        <Tooltip title="Positions are locked">
                                                            <Lock/>
                                                        </Tooltip>
                                                    }
                                                    {!event.positionsLocked && !isSignedUpForAnotherPosition(position) &&
                                                        <EventPositionSignupForm user={session.user} event={event}
                                                                                 position={position}
                                                                                 controllers={position.controllers as User[]}/>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>}
                        </CardContent>
                    </Card>
                }

            </Stack>
        </Container>)
    );
}

