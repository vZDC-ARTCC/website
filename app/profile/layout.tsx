import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Box, Stack, Typography} from "@mui/material";

export default async function Layout({children}: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <Typography textAlign="center" variant="h5">You must login to view this page.</Typography>
        );
    }

    return (
        <>
            {children}
        </>
    );
}