import React from 'react';
import {Card, CardContent, Stack, Typography} from "@mui/material";
import IcaoForm from "@/components/Form/IcaoForm";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h5" sx={{mb: 2,}}>Airport Information</Typography>
                    <IcaoForm basePath="/airports"/>
                </CardContent>
            </Card>
            {children}
        </Stack>
    );
}