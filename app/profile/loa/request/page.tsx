import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";
import {Card, CardContent, Typography} from "@mui/material";
import LoaForm from "@/components/LOA/LOAForm";
import ErrorCard from "@/components/Error/ErrorCard";

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (session?.user.noRequestLoas) {
        return <ErrorCard heading="Leave of Absence Request" message="You are not allowed to request LOAs."/>
    }

    const loa = await prisma.lOA.findFirst({
        where: {
            userId: session?.user.id,
            status: {
                not: "INACTIVE",
            },
        },
    });

    if (loa) {
        return <ErrorCard heading="Leave of Absence Request" message="You already have an active LOA."/>
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