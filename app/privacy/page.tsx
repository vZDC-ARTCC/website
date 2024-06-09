import React from 'react';
import {Card, CardContent, Container, Typography} from "@mui/material";

export default async function Page() {
    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography variant="h5">Privacy & Terms</Typography>
                    <Typography>This website follows the guidelines of VATUSA and VATSIM.</Typography>
                    <Typography variant="subtitle2">If you have questions, do not hesitate to email
                        zdc_staff@vatusa.net</Typography>
                </CardContent>
            </Card>

        </Container>
    );
}