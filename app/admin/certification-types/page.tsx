import React from 'react';
import {
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import prisma from "@/lib/db";
import {Add, Block, Edit} from "@mui/icons-material";
import Link from "next/link";
import CertificationTypeDeleteButton from "@/components/CertificationTypes/CertificationTypeDeleteButton";

export default async function Page() {

    const certificationTypes = await prisma.certificationType.findMany({
        orderBy: {
            order: 'asc',
        },
        include: {
            certifications: true,
            soloCertifications: true,
        }
    });

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Typography variant="h5">Certification Types</Typography>
                    <Link href="/admin/certification-types/new">
                        <Button variant="contained" size="large" startIcon={<Add/>}>New Certification Type</Button>
                    </Link>
                </Stack>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Order</TableCell>
                                <TableCell>Controllers Certified</TableCell>
                                <TableCell>Active Solo Certifications</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {certificationTypes.map((certificationType) => (
                                <TableRow key={certificationType.id}>
                                    <TableCell>{certificationType.name}</TableCell>
                                    <TableCell>{certificationType.order}</TableCell>
                                    <TableCell>{certificationType.certifications.length}</TableCell>
                                    <TableCell>{certificationType.canSoloCert ? certificationType.soloCertifications.length :
                                        <Block/>}</TableCell>
                                    <TableCell>
                                        <Link href={`/admin/certification-types/edit/${certificationType.id}`}
                                              style={{color: 'inherit',}}>
                                            <IconButton>
                                                <Edit/>
                                            </IconButton>
                                        </Link>
                                        <CertificationTypeDeleteButton certificationType={certificationType}/>
                                    </TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

            </CardContent>
        </Card>
    );
}