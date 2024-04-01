import React from 'react';
import {Card, CardContent, Container, Typography} from "@mui/material";
import VisitorForm from "@/components/Visitor/VisitorForm";

export default function Page() {

    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography variant="h5">Visitor Application</Typography>
                    <Typography sx={{my: 1,}}>We appreciate your interest in visiting the Virtual Washington ARTCC. Fill
                        out the following form and a staff member will take a look at your application. This process
                        might take up to 7 business days.</Typography>
                    <VisitorForm/>
                </CardContent>
            </Card>
        </Container>

    );

}