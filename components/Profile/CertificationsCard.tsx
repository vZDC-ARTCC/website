import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {getIconForCertificationOption} from "@/lib/certification";
import {getDaysLeft} from "@/lib/date";

export default async function CertificationsCard({cid}: { cid: string, }) {

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
        <Card sx={{height: '100%',}}>
            <CardContent>
                <Typography variant="h6">Certifications</Typography>
                <TableContainer sx={{maxHeight: 500,}}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Certification</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {certificationTypes.map((certificationType) => (
                                <TableRow key={certificationType.id}>
                                    <TableCell>{certificationType.name}</TableCell>
                                    <TableCell>
                                        {getIconForCertificationOption(controller.certifications.find((certification) => certification.certificationType.id === certificationType.id)?.certificationOption || "NONE")}
                                        {controller.soloCertifications.filter((soloCertification) => soloCertification.certificationType.id === certificationType.id).map((soloCertification) => (
                                            <Tooltip key={soloCertification.id} title="Solo Certified">
                                                <Box>
                                                    <Typography>{soloCertification.position}*</Typography>
                                                    <Typography
                                                        variant="subtitle2">{getDaysLeft(soloCertification.expires)}</Typography>
                                                </Box>
                                            </Tooltip>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>

            </CardContent>
        </Card>
    );
}