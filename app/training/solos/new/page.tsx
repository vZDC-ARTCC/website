import React from 'react';
import prisma from "@/lib/db";
import {Card, CardContent, Typography} from "@mui/material";
import SoloForm from "@/components/SoloCertification/SoloForm";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";

export default async function Page() {

    const controllers = await prisma.user.findMany({
        orderBy: {
            lastName: 'asc',
        },
    });
    const session = await getServerSession(authOptions);

    if (!session || !session?.user.roles.includes("INSTRUCTOR")) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">You must be an instructor to access this page.</Typography>
                </CardContent>
            </Card>
        );
    }

    const certificationTypes = await prisma.certificationType.findMany({
        where: {
            canSoloCert: true,
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>New Solo Certification</Typography>
                <SoloForm controllers={controllers as User[]} certificationTypes={certificationTypes}/>
            </CardContent>
        </Card>
    );

}