import React from 'react';
import {
    Button,
    Card,
    CardContent,
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
import Link from "next/link";
import {Add} from "@mui/icons-material";
import {getRating} from "@/lib/vatsim";
import SoloCertificationDeleteButton from "@/components/SoloCertification/SoloCertificationDeleteButton";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";

export default async function Page() {

    const solos = await prisma.soloCertification.findMany({
        orderBy: {
            expires: 'desc',
        },
        include: {
            certificationType: true,
            controller: true,
        },
    });

    const session = await getServerSession(authOptions);

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Stack direction="column" spacing={1}>
                        <Typography variant="h5">Active Solo Certifications</Typography>
                        <Typography>All times are in GMT</Typography>
                    </Stack>
                    {session?.user.roles.includes("INSTRUCTOR") && <Link href="/training/solos/new">
                        <Button variant="contained" size="large" startIcon={<Add/>}>Grant Solo Certification</Button>
                    </Link>}
                </Stack>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Controller</TableCell>
                                <TableCell>Certification</TableCell>
                                <TableCell>Position</TableCell>
                                <TableCell>Expires</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {solos.map((solo) => (
                                <TableRow key={solo.id}>
                                    <TableCell>
                                        <Link href={`/training/controller/${solo.controller.cid}`} target="_blank"
                                              style={{color: 'inherit'}}>
                                            <Typography>{solo.controller.firstName} {solo.controller.lastName} - {getRating(solo.controller.rating)}</Typography>
                                        </Link>
                                    </TableCell>
                                    <TableCell>{solo.certificationType.name}</TableCell>
                                    <TableCell>{solo.position}</TableCell>
                                    <TableCell>{solo.expires.toUTCString()}</TableCell>
                                    <TableCell>
                                        <SoloCertificationDeleteButton soloCertification={solo}/>
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