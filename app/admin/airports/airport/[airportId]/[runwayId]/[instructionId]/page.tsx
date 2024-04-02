import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Typography} from "@mui/material";
import ProcedureForm from "@/components/Airports/ProcedureForm";

export default async function Page({params}: {
    params: { airportId: string, runwayId: string, instructionId: string, },
}) {

    const {runwayId, instructionId} = params;

    const instruction = await prisma.runwayInstruction.findUnique({
        where: {
            id: instructionId,
            runwayId,
        },
        include: {
            runway: {
                include: {
                    airport: true,
                },
            },
        },
    });

    if (!instruction) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>{instruction.route} -
                    Runway {instruction.runway.name} - {instruction.runway.airport.icao}</Typography>
                <ProcedureForm instruction={instruction} runwayId={instruction.runwayId}/>
            </CardContent>
        </Card>
    );
}