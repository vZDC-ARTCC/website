import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Box, Typography} from "@mui/material";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: 'Profile | vZDC',
    description: 'vZDC profile page',
};

export default async function Layout({children}: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <Typography textAlign="center" variant="h5">You must login to view this page.</Typography>
        );
    }

    if (session.user.controllerStatus === "NONE") {
        return (
            <Box>
                <Typography textAlign="center" variant="h5">You must be a rostered controller to access this
                    page.</Typography>
            </Box>
        );
    }

    return (
        <>
            {children}
        </>
    );
}