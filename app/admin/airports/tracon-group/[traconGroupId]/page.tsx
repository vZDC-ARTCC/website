import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Typography} from "@mui/material";
import TraconGroupForm from "@/components/Airports/TraconGroupForm";

export default async function Page({params}: { params: { traconGroupId: string, }, }) {

    const {traconGroupId} = params;
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
                <Typography variant="h5" sx={{mb: 2,}}>Edit TRACON Group</Typography>
                <TraconGroupForm traconGroup={traconGroup}/>
            </CardContent>
        </Card>
    );
}