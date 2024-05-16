import React from 'react';
import {Card, CardContent, Container, Grid, Typography} from "@mui/material";
import prisma from "@/lib/db";
import {getAllTimeHours, getMonthHours, getYearHours} from "@/lib/hours";
import CidForm from "@/components/Form/CidForm";

export default async function Layout({children}: { children: React.ReactNode }) {

    const membership = await prisma.user.findMany({
        where: {
            controllerStatus: {
                not: 'NONE'
            },
        },
        select: {
            id: true,
        },
    });

    // Get the current month and year
    const now = new Date();

    const monthHours = await getMonthHours(now.getMonth(), now.getFullYear());
    const yearHours = await getYearHours(now.getFullYear());
    const allTimeHours = await getAllTimeHours();


    return (
        <Container maxWidth="lg">
            <Grid container columns={4} spacing={2}>
                <Grid item xs={4} sm={2} md={1}>
                    <Card>
                        <CardContent>
                            <Typography>Active Controllers</Typography>
                            <Typography variant="h4">{membership.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} sm={2} md={1}>
                    <Card>
                        <CardContent>
                            <Typography>Month Hours</Typography>
                            <Typography variant="h4">{monthHours}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} sm={2} md={1}>
                    <Card>
                        <CardContent>
                            <Typography>Year Hours</Typography>
                            <Typography variant="h4">{yearHours}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} sm={2} md={1}>
                    <Card>
                        <CardContent>
                            <Typography>All-Time Hours</Typography>
                            <Typography variant="h4">{allTimeHours}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <CardContent>
                            <CidForm basePath="/controllers/statistics"/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {children}
        </Container>
    );
}