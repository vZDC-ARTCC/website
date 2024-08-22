import React from 'react';
import IcaoForm from "@/components/Form/IcaoForm";
import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Charts | vZDC',
    description: 'vZDC charts page',
};


export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <Container maxWidth="md">
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" sx={{mb: 1,}}>Charts Database</Typography>
                        <IcaoForm basePath="/charts"/>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        {children}
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
}