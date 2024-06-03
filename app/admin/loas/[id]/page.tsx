import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Box, Card, CardContent, Chip, Grid, Stack, Typography} from "@mui/material";
import VisitorApplicationDecisionForm from "@/components/VisitorApplication/VisitorApplicationDecisionForm";
import {LOAStatus, VisitorApplicationStatus} from "@prisma/client";
import {getRating} from "@/lib/vatsim";
import {User} from "next-auth";
import LoaDecisionForm from "@/components/LOA/LOADecisionForm";

export default async function Page({params}: { params: { id: string } }) {

    const {id} = params;

    const loa = await prisma.lOA.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });

    if (!loa) {
        notFound();
    }

    const getLoaColor = (status: LOAStatus) => {
        switch (status) {
            case "APPROVED":
                return "success";
            case "DENIED":
                return "error";
            case "PENDING":
                return "warning";
            default:
                return "info";
        }
    }

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h5">Leave of Absence</Typography>
                    <Chip label={loa.status} color={getLoaColor(loa.status)}/>
                </Stack>
                <Typography
                    variant="subtitle2">{loa.user.firstName} {loa.user.lastName} ({loa.user.cid})</Typography>
                <Grid container spacing={2} columns={2} sx={{mt: 2, mb: 4,}}>
                    <Grid item xs={2} md={1}>
                        <Typography variant="subtitle2">Start</Typography>
                        <Typography variant="body2">{loa.start.toDateString()}</Typography>
                    </Grid>
                    <Grid item xs={2} md={1}>
                        <Typography variant="subtitle2">End</Typography>
                        <Typography variant="body2">{loa.end.toDateString()}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="subtitle2">Reason for LOA</Typography>
                        <Typography variant="body2">{loa.reason}</Typography>
                    </Grid>
                    {loa.status === "PENDING" && <Grid item xs={2}>
                        <LoaDecisionForm loa={loa}/>
                    </Grid>}
                </Grid>
            </CardContent>
        </Card>
    );
}