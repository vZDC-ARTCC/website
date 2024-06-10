import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Card, CardContent, Container, Typography} from "@mui/material";
import StaffingRequestFormWrapper from "@/components/StaffingRequest/StaffingRequestFormWrapper";
import ErrorCard from "@/components/Error/ErrorCard";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: 'Request Staffing | vZDC',
    description: 'vZDC staffing request page',
};

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return <ErrorCard heading="Staffing Request" message="You must be logged in to view this page."/>
    }


    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography variant="h5" sx={{mb: 2,}}>Staffing Request</Typography>
                    <StaffingRequestFormWrapper user={session.user}/>
                </CardContent>
            </Card>
        </Container>
    );
}