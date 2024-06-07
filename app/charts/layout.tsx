import React from 'react';
import IcaoForm from "@/components/Form/IcaoForm";
import {Container, Stack} from "@mui/material";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <Container maxWidth="md">
            <Stack direction="column" spacing={2}>
                <IcaoForm basePath="/charts"/>
                {children}
            </Stack>
        </Container>
    );
}