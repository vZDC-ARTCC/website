import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import IncidentReportForm from "@/components/Incident/IncidentReportForm";
import prisma from "@/lib/db";
import {User} from "next-auth";

export default async function Page() {

    const allUsers = await prisma.user.findMany({
        where: {
            controllerStatus: {
                not: "NONE",
            },
        },
        orderBy: {
            lastName: 'asc',
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>New Incident Report</Typography>
                <IncidentReportForm allUsers={allUsers as User[]}/>
            </CardContent>
        </Card>
    );
}