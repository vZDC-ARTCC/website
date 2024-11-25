import React from 'react';
import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import IcaoForm from "@/components/Form/IcaoForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Airports | vZDC',
    description: 'vZDC airports page',
};

export default function Layout({children}: { children: React.ReactNode }) {

    return (
        <Container maxWidth="lg">
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" sx={{mb: 2,}}>Airport Information</Typography>
                        <IcaoForm basePath="/airports"/>
                    </CardContent>
                </Card>
                {children}
            </Stack>
        </Container>

    );
}