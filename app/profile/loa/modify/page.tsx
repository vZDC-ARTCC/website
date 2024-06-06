import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";
import {Card, CardContent, Typography} from "@mui/material";
import LoaForm from "@/components/LOA/LOAForm";

export default async function Page() {

    const session = await getServerSession(authOptions);

    const loa = await prisma.lOA.findFirst({
        where: {
            userId: session?.user.id,
            status: {
                not: "INACTIVE",
            },
        },
    });

    if (!loa) {
        throw new Error("You do not have an LOA.  Try requesting one in your profile.");
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Leave of Absence</Typography>
                <Typography sx={{mb: 2,}}>You can modify your LOA below. If you make any changes or press save, the LOA
                    will switch back to PENDING. This will CANCEL your previous LOA if it was approved.</Typography>
                <LoaForm loa={loa}/>
            </CardContent>
        </Card>
    );
}