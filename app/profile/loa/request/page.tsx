import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";
import {Card, CardContent, Typography} from "@mui/material";
import LoaForm from "@/components/LOA/LOAForm";

export default async function Page() {

    const session = await getServerSession(authOptions);

    const loa = await prisma.lOA.findUnique({
        where: {
            userId: session?.user.id,
        },
    });

    if (loa) {
        throw new Error("You already have a LOA request.");
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Leave of Absence Request</Typography>
                <Typography sx={{mb: 2,}}>Your LOA will be submitted to staff for approval.</Typography>
                <LoaForm/>
            </CardContent>
        </Card>
    );
}