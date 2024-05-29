import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Card, CardContent, Grid, Typography} from "@mui/material";
import ProfileCard from "@/components/Profile/ProfileCard";
import DossierForm from "@/components/Dossier/DossierForm";
import DossierTable from "@/components/Dossier/DossierTable";
import CertificationForm from "@/components/Certifications/CertificationForm";

export default async function AdminControllerInformation({cid}: { cid: string, }) {
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

    const session = await getServerSession(authOptions);

    return session?.user && (
        <Grid container columns={2} spacing={2}>
            <Grid item xs={2}>
                <ProfileCard user={controller as User} admin={session.user.roles.includes("STAFF")}/>
            </Grid>
            <Grid item xs={2} lg={1}>
                <Grid container columns={1} spacing={2}>
                    <Grid item xs={1}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{mb: 1,}}>Add Dossier Entry</Typography>
                                <DossierForm cid={controller.cid}/>
                                <Typography variant="h6" sx={{my: 2,}}>Member Dossier</Typography>
                                <DossierTable dossier={controller.dossier}
                                              ableToViewConfidential={session.user.staffPositions.some((sp) => {
                                                  return sp === 'ATM' || sp === 'DATM' || sp === 'TA';
                                              })}/>
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