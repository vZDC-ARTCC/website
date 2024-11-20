import React from 'react';
import {notFound} from "next/navigation";
import {Card, CardContent, Typography} from "@mui/material";
import prisma from "@/lib/db";
import AirportForm from "@/components/Airports/AirportForm";

export default async function Page(props: { searchParams: Promise<{ traconGroupId?: string, }> }) {
    const searchParams = await props.searchParams;

    const {traconGroupId} = searchParams;

    const traconGroup = await prisma.traconGroup.findUnique({
        where: {
            id: traconGroupId,
        },
    });

    if (!traconGroup) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">New Airport</Typography>
                <Typography variant="subtitle2" sx={{mb: 2,}}>{traconGroup.name}</Typography>
                <AirportForm traconGroupId={traconGroup.id}/>
            </CardContent>
        </Card>
    );
}