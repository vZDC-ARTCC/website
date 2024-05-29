import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Grid, Typography} from "@mui/material";
import TrainingMenu from "@/components/Admin/TrainingMenu";

export default async function Layout({children}: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.roles.some(r => ["MENTOR", "INSTRUCTOR", "STAFF"].includes(r))) {
        return (
            <Typography variant="h5" textAlign="center">You do not have access to this page.</Typography>
        );
    }

    return (
        <Grid container columns={9} spacing={2}>
            <Grid item xs={9} lg={2}>
                <TrainingMenu user={session.user}/>
            </Grid>
            <Grid item xs>
                {children}
            </Grid>
        </Grid>
    );
}