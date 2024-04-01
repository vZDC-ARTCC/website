import React from 'react';
import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import {Check, CheckCircle} from "@mui/icons-material";

export default function Page() {
    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{mb: 2,}}>
                        <CheckCircle color="success" fontSize="large"/>
                        <Typography variant="h5">Application Submitted</Typography>
                    </Stack>
                    <Container maxWidth="sm">
                        <Typography>Your visiting application was submitted successfully. You should receive an email
                            about your application within 7 business days.</Typography>
                    </Container>
                </CardContent>
            </Card>
        </Container>

    );
}