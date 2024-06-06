import React from 'react';
import {Container} from "@mui/material";

export default async function Layout({children}: { children: React.ReactNode }) {
    return (
        <Container maxWidth="md">
            {children}
        </Container>
    );
}