import React from 'react';
import {Box, Card, CardContent, Stack, Typography} from "@mui/material";
import CidForm from "@/components/Form/CidForm";

export default function Layout({children}: { children: React.ReactNode, }) {
    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h5">Staff Management</Typography>
                    <Box sx={{my: 2,}}>
                        <CidForm basePath="/admin/staff"/>
                    </Box>
                </CardContent>
            </Card>
            <Box>
                {children}
            </Box>
        </Stack>
    );
}