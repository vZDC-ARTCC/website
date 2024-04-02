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
import RunwayForm from "@/components/Airports/RunwayForm";
import Link from "next/link";
import {Edit} from "@mui/icons-material";
import ProcedureDeleteButton from "@/components/Airports/ProcedureDeleteButton";
import ProcedureForm from "@/components/Airports/ProcedureForm";

export default async function Page({params}: { params: { airportId: string, runwayId: string, }, }) {

    const {airportId, runwayId} = params;

    const runway = await prisma.runway.findUnique({
        where: {
            id: runwayId,
            airportId,
        },
        include: {
            runwayInstructions: true,
            airport: true,
        },
    });

    if (!runway) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>Runway {runway.name} - {runway.airport.icao}</Typography>
                <RunwayForm runway={runway} airportId={runway.airportId}/>
                <Typography variant="h6" sx={{my: 2,}}>Procedures</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Route</TableCell>
                                <TableCell>Procedure</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {runway.runwayInstructions.map((instruction) => (
                                <TableRow key={instruction.id}>
                                    <TableCell>{instruction.route}</TableCell>
                                    <TableCell>{instruction.procedure}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit Procedure">
                                            <Link
                                                href={`/admin/airport/airports/${airportId}/${runwayId}/${instruction.id}`}>
                                                <IconButton>
                                                    <Edit/>
                                                </IconButton>
                                            </Link>
                                        </Tooltip>
                                        <ProcedureDeleteButton instruction={instruction}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" sx={{my: 1,}}>New Procedure</Typography>
                <ProcedureForm runwayId={runway.id}/>
            </CardContent>
        </Card>
    );
}