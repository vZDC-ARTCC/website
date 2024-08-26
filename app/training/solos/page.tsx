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
import SoloCertificationTable from "@/components/SoloCertification/SoloCertificationTable";

export default async function Page() {

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
                <SoloCertificationTable/>
            </CardContent>
        </Card>
    );

}