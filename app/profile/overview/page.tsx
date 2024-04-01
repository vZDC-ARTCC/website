import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Grid, Typography} from "@mui/material";
import ProfileCard from "@/components/Profile/ProfileCard";
import CertificationsCard from "@/components/Profile/CertificationsCard";
import FeedbackCard from "@/components/Profile/FeedbackCard";

export default async function Page() {

    const session = await getServerSession(authOptions);

    const user = session?.user;
    return user && (
        <Grid container columns={6} spacing={2}>
            <Grid item xs={6}>
                <Typography variant="h4">Your Profile</Typography>
            </Grid>
            <Grid item xs={6}>
                <ProfileCard user={user} editButton/>
            </Grid>
            <Grid item xs={6} md={4}>
                <FeedbackCard user={user}/>
            </Grid>
            <Grid item xs={6} md={2}>
                <CertificationsCard cid={user.cid}/>
            </Grid>
        </Grid>
    );
}