import React from 'react';
import {Card, CardContent, Container, Typography} from "@mui/material";
import prisma from "@/lib/db";
import {getServerSession, User} from "next-auth";
import FeedbackFormWrapper from "@/components/Feedback/FeedbackFormWrapper";
import {authOptions} from "@/auth/auth";

export default async function Page() {

    const controllers = await prisma.user.findMany({
        orderBy: {
            lastName: 'asc',
        },
        where: {
            roles: {
                has: "CONTROLLER",
            },
        },
    });

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error('You must be signed in to view this page.');
    }

    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography variant="h5">Feedback</Typography>
                    <FeedbackFormWrapper controllers={controllers as User[]} user={session.user}/>
                </CardContent>
            </Card>
        </Container>
    );

}