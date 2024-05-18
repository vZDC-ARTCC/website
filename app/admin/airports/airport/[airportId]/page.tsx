import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {
    Card,
    CardContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import AirportForm from "@/components/Airports/AirportForm";
import Link from "next/link";
import {Edit} from "@mui/icons-material";
import RunwayDeleteButton from "@/components/Airports/RunwayDeleteButton";
import RunwayForm from "@/components/Airports/RunwayForm";

export default async function Page({params}: { params: { airportId: string, }, }) {

    const {airportId} = params;

    const airport = await prisma.airport.findUnique({
        where: {
            id: airportId,
        },
        include: {
            runways: {
                include: {
                    runwayInstructions: true,
                },
            },
        },
    });

    if (!airport) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>{airport.icao}</Typography>
                <AirportForm airport={airport} traconGroupId={airport.traconGroupId}/>
                <Typography variant="h6" sx={{my: 2,}}>Runways</Typography>
                <TableContainer sx={{maxHeight: 600,}}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Identifier</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {airport.runways.map((runway) => (
                                <TableRow key={runway.id}>
                                    <TableCell>{runway.name}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit Runway">
                                            <Link href={`/admin/airports/airport/${airport.id}/${runway.id}`}>
                                                <IconButton>
                                                    <Edit/>
                                                </IconButton>
                                            </Link>
                                        </Tooltip>
                                        <RunwayDeleteButton runway={runway}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" sx={{my: 1,}}>New Runway</Typography>
                <RunwayForm airportId={airport.id}/>
            </CardContent>
        </Card>
    );
}