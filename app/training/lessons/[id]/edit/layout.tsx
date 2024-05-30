import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Card, CardContent, Typography} from "@mui/material";

export default async function Layout({children}: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user.roles.includes("STAFF")) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">You must be staff to access this page.</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {children}
        </>
    );
}