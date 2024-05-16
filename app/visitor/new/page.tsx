import React from 'react';
import {Card, CardContent, Container, Typography} from "@mui/material";
import VisitorForm from "@/components/Visitor/VisitorForm";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";
import {getRating} from "@/lib/vatsim";

const DEV_MODE = process.env.NODE_ENV === "development";

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("You must be logged in to submit a visitor application.");
    }

    if (session.user.controllerStatus !== "NONE") {
        throw new Error("You are already a rostered controller.");
    }

    if (!DEV_MODE && session.user.rating < 4) {
        throw new Error(`You must be a(n) ${getRating(4)} or higher to submit a visitor application.`);
    }

    const visitorApplication = await prisma.visitorApplication.findFirst({
        where: {
            userId: session.user.id,
            status: "PENDING",
        },
    });

    if (visitorApplication) {
        throw new Error("You already have a pending visitor application.");
    }

    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography variant="h5">Visitor Application</Typography>
                    <Typography sx={{my: 1,}}>We appreciate your interest in visiting the Virtual Washington ARTCC. Fill
                        out the following form and a staff member will take a look at your application. This process
                        might take up to 7 business days.</Typography>
                    <VisitorForm user={session.user}/>
                </CardContent>
            </Card>
        </Container>

    );

}