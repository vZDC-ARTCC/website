import React from 'react';
import {Container} from "@mui/material";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import ErrorCard from "@/components/Error/ErrorCard";

export default async function Layout({children}: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (session?.user.noRequestLoas) {
        return <ErrorCard heading="LOA" message="You are not allowed to access this page."/>
    }

    return (
        <Container maxWidth="md">
            {children}
        </Container>
    );
}