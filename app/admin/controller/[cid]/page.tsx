import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Grid, Typography} from "@mui/material";
import ProfileCard from "@/components/Profile/ProfileCard";
import {User} from "next-auth";
import CertificationForm from "@/components/Certifications/CertificationForm";
import DossierTable from "@/components/Dossier/DossierTable";
import DossierForm from "@/components/Dossier/DossierForm";

export default async function Page({params}: { params: { cid: string, }, }) {

    const {cid} = params;

    const controller = await prisma.user.findUnique({
        where: {
            cid,
        },
        include: {
            certifications: {
                include: {
                    certificationType: true,
                },
            },
            soloCertifications: {
                include: {
                    certificationType: true,
                },
            },
            dossier: {
                orderBy: {
                    timestamp: 'desc',
                },
                include: {
                    writer: true,
                },
            },
        },
    });

    if (!controller) {
        notFound();
    }

    const certificationTypes = await prisma.certificationType.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    return (
        <Grid container columns={2} spacing={2}>
            <Grid item xs={2}>
                <ProfileCard user={controller as User} admin/>
            </Grid>
            <Grid item xs={2} lg={1}>
                <Grid container columns={1} spacing={2}>
                    <Grid item xs={1}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{mb: 1,}}>Add Dossier Entry</Typography>
                                <DossierForm cid={controller.cid}/>
                                <Typography variant="h6" sx={{my: 2,}}>Member Dossier</Typography>
                                <DossierTable dossier={controller.dossier}/>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={2} lg={1}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Certifications</Typography>
                        <CertificationForm cid={controller.cid} certificationTypes={certificationTypes}
                                           certifications={controller.certifications}
                                           soloCertifications={controller.soloCertifications}/>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}