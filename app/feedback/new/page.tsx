import React from 'react';
import {Card, CardContent, Container, Typography} from "@mui/material";
import prisma from "@/lib/db";
import {User} from "next-auth";
import FeedbackFormWrapper from "@/components/Feedback/FeedbackFormWrapper";

export default async function Page() {

    const controllers = await prisma.user.findMany({
        orderBy: {
            lastName: 'asc',
        }
    });

    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography variant="h5">New Feedback</Typography>
                    <FeedbackFormWrapper controllers={controllers as User[]}/>
                </CardContent>
            </Card>
        </Container>
    );

}