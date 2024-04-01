import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Box, Card, CardContent, Chip, Grid, Stack, Typography} from "@mui/material";
import VisitorApplicationDecisionForm from "@/components/VisitorApplication/VisitorApplicationDecisionForm";
import {VisitorApplicationStatus} from "@prisma/client";

export default async function Page({params}: { params: { id: string } }) {

    const {id} = params;

    const application = await prisma.visitorApplication.findUnique({
        where: {
            id,
        },
    });

    if (!application) {
        notFound();
    }

    const getStatusColor = (status: VisitorApplicationStatus) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'APPROVED':
                return 'success';
            case 'DENIED':
                return 'error';
            default:
                return 'default';
        }
    }

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h5">Visitor Application</Typography>
                    <Chip label={application.status} color={getStatusColor(application.status)}/>
                </Stack>
                <Typography
                    variant="subtitle2">{application.firstName} {application.lastName} ({application.cid})</Typography>
                <Typography variant="subtitle2">{application.submittedAt.toUTCString()}</Typography>
                <Grid container spacing={2} columns={2} sx={{mt: 2, mb: 4,}}>
                    <Grid item xs={2} md={1}>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography variant="body2">{application.email}</Typography>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <Typography variant="subtitle2">CID</Typography>
                        <Typography variant="body2">{application.cid}</Typography>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <Typography variant="subtitle2">Rating</Typography>
                        <Typography variant="body2">{application.rating}</Typography>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <Typography variant="subtitle2">Home Facility</Typography>
                        <Typography variant="body2">{application.homeFacility}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="subtitle2">Reason for Visiting</Typography>
                        <Typography variant="body2">{application.whyVisit}</Typography>
                    </Grid>
                    {application.status === "DENIED" && <Grid item xs={2}>
                        <Typography variant="subtitle2">Reason for Denial</Typography>
                        <Typography variant="body2">{application.reasonForDenial || 'N/A'}</Typography>
                    </Grid>}
                </Grid>
                {application.status === "PENDING" && <VisitorApplicationDecisionForm application={application}/>}
            </CardContent>
        </Card>
    );
}