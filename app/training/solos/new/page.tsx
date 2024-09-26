import React from 'react';
import prisma from "@/lib/db";
import {Card, CardContent, Typography} from "@mui/material";
import SoloForm from "@/components/SoloCertification/SoloForm";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import ErrorCard from "@/components/Error/ErrorCard";

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

    if (certificationTypes.length === 0) {
        return <ErrorCard heading="Unable to grant solo certification"
                          message="There are no certification types that are allowed to be solo certified.  Create or modify the certification types to continue."/>
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>New Solo Certification</Typography>
                <SoloForm controllers={controllers as User[]} certificationTypes={certificationTypes}/>
            </CardContent>
        </Card>
    );

}