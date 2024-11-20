import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Grid2, Typography} from "@mui/material";
import TrainingMenu from "@/components/Admin/TrainingMenu";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Training | vZDC',
    description: 'vZDC training page',
};

export default async function Layout({children}: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.roles.some(r => ["MENTOR", "INSTRUCTOR", "STAFF"].includes(r))) {
        return (
            <Typography variant="h5" textAlign="center">You do not have access to this page.</Typography>
        );
    }

    return (
        (<Grid2 container columns={9} spacing={2}>
            <Grid2
                size={{
                    xs: 9,
                    lg: 2
                }}>
                <TrainingMenu/>
            </Grid2>
            <Grid2 size="grow">
                {children}
            </Grid2>
        </Grid2>)
    );
}