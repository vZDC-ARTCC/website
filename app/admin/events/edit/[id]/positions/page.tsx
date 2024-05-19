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

export default async function Page({params}: { params: { id: string, } }) {

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
                                                <Link key={controller.id} href={`/admin/controller/${controller.cid}`}
                                                      style={{color: 'inherit'}}>
                                                    <Typography>{controller.firstName}</Typography>
                                                </Link>
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