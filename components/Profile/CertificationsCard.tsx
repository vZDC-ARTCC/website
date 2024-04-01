import React from 'react';
import {User} from "next-auth";
import {
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import {Check, Circle, Clear} from "@mui/icons-material";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {getIconForCertificationOption} from "@/lib/certification";
import {SoloCertification} from "@prisma/client";
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
        <Card>
            <CardContent>
                <Typography variant="h6">Certifications</Typography>
                <Table>
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
            </CardContent>
        </Card>
    );
}