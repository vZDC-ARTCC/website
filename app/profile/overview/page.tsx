import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Button, Card, CardActions, CardContent, Chip, Grid2, Stack, Typography} from "@mui/material";
import ProfileCard from "@/components/Profile/ProfileCard";
import CertificationsCard from "@/components/Profile/CertificationsCard";
import FeedbackCard from "@/components/Profile/FeedbackCard";
import TrainingCard from "@/components/Profile/TrainingCard";
import LinksCard from "@/components/Profile/LinksCard";
import EventSignupCard from "@/components/Profile/EventSignupCard";
import prisma from "@/lib/db";
import LoaDeleteButton from "@/components/LOA/LoaDeleteButton";
import Link from "next/link";
import {Edit} from "@mui/icons-material";
import {LOAStatus} from "@prisma/client";
import AssignedMentorsCard from "@/components/Profile/AssignedMentorsCard";

export default async function Page() {

    const session = await getServerSession(authOptions);

    const user = session?.user;

    const loa = await prisma.lOA.findFirst({
        where: {
            userId: user?.id,
            status: {
                not: "INACTIVE",
            },
        },
    });

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

    return user && (
        <Grid2 container columns={6} spacing={2}>
            <Grid2 size={6}>
                <Typography variant="h4">Your Profile</Typography>
            </Grid2>
            {loa && <Grid2 size={6}>
                <Card>
                    <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1,}}>
                            <Typography variant="h6">Active LOA Request</Typography>
                            <Chip label={loa.status} color={getLoaColor(loa.status)}/>
                        </Stack>
                        <Typography
                            variant="subtitle2">{loa.start.toDateString()} - {loa.end.toDateString()}</Typography>
                    </CardContent>
                    <CardActions>
                        <Link href="/profile/loa/modify">
                            <Button variant="contained" startIcon={<Edit/>}>
                                Modify
                            </Button>
                        </Link>
                        <LoaDeleteButton loa={loa}/>
                    </CardActions>
                </Card>
            </Grid2>}
            <Grid2
                size={{
                    xs: 6,
                    md: 2
                }}>
                <ProfileCard user={user}/>
            </Grid2>
            <Grid2
                size={{
                    xs: 6,
                    md: 2
                }}>
                <AssignedMentorsCard user={user}/>
            </Grid2>
            <Grid2
                size={{
                    xs: 6,
                    md: 2
                }}>
                <CertificationsCard cid={user.cid}/>
            </Grid2>
            <Grid2
                size={{
                    xs: 6,
                    md: 4
                }}>
                <FeedbackCard user={user}/>
            </Grid2>
            <Grid2
                size={{
                    xs: 6,
                    md: 2
                }}>
                <LinksCard/>
            </Grid2>
            <Grid2
                size={{
                    xs: 6,
                    md: 4
                }}>
                <TrainingCard user={user}/>
            </Grid2>
            <Grid2
                size={{
                    xs: 6,
                    md: 2
                }}>
                <EventSignupCard user={user}/>
            </Grid2>
        </Grid2>
    );
}