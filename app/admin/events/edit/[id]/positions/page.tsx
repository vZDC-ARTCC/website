import React from 'react';
import {notFound} from "next/navigation";
import prisma from "@/lib/db";
import {
    Box,
    Card,
    CardContent,
    IconButton,
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
import Link from "next/link";
import {ArrowBack, Edit} from "@mui/icons-material";
import EventPositionDeleteButton from "@/components/EventPosition/EventPositionDeleteButton";
import EventPositionForm from "@/components/EventPosition/EventPositionForm";
import {getRating} from "@/lib/vatsim";
import EventPositionsLockButton from "@/components/EventPosition/EventPositionsLockButton";
import EventControllerRemoveForm from "@/components/EventPosition/EventControllerRemoveForm";
import {User} from "next-auth";
import ControllerManualAddForm from "@/components/EventPosition/ControllerManualAddForm";

export default async function Page(props: { params: Promise<{ id: string, }> }) {
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
                orderBy: {
                    position: 'asc',
                }
            },
        },
    });

    if (!event) {
        notFound();
    }

    const users = await prisma.user.findMany({
        where: {
            controllerStatus: {
                not: "NONE",
            },
        },
        orderBy: {
            lastName: 'asc',
        }
    });

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Link href={`/admin/events/edit/${event.id}`} style={{color: 'inherit',}}>
                        <Tooltip title="Go Back">
                            <IconButton color="inherit">
                                <ArrowBack fontSize="large"/>
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Typography variant="h5">Positions - {event.name}</Typography>
                    <EventPositionsLockButton event={event}/>
                </Stack>
                <Box sx={{my: 3,}}>
                    <Typography variant="h6" sx={{mb: 1,}}>Add Controller</Typography>
                    <ControllerManualAddForm eventPositions={event.positions} users={users as User[]} />
                    <TableContainer sx={{maxHeight: 600,}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Position</TableCell>
                                    <TableCell>Signup Cap</TableCell>
                                    <TableCell>Minimum Rating</TableCell>
                                    <TableCell>Controllers (click each to open profile)</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {event.positions.map((position) => (
                                    <TableRow key={position.id}>
                                        <TableCell>{position.position}</TableCell>
                                        <TableCell>{position.signupCap}</TableCell>
                                        <TableCell>{getRating(position.minRating || -1) || 'N/A'}</TableCell>
                                        <TableCell>
                                            {position.controllers.map((controller) => (
                                                <Stack key={controller.id}  direction="row" spacing={1} alignItems="center">
                                                    <Link href={`/admin/controller/${controller.cid}`} target="_blank"
                                                          style={{color: 'inherit'}}>
                                                        <Typography>{controller.firstName} {controller.lastName} - {getRating(controller.rating)}</Typography>
                                                    </Link>
                                                    <EventControllerRemoveForm event={event} position={position} controller={controller as User} />
                                                </Stack>

                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/events/edit/${event.id}/positions/${position.id}`}
                                                  style={{color: 'inherit',}}>
                                                <IconButton>
                                                    <Edit/>
                                                </IconButton>
                                            </Link>
                                            <EventPositionDeleteButton eventPosition={position}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Typography variant="h6" sx={{mb: 1,}}>New Event Position</Typography>
                <EventPositionForm event={event}/>
            </CardContent>
        </Card>
    );
}