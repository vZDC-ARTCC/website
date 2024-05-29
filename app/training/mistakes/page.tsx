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
import SearchForm from "@/components/Search/SearchForm";
import Link from "next/link";
import {Add, Edit, Visibility} from "@mui/icons-material";
import CommonMistakeDeleteButton from "@/components/CommonMistake/CommonMistakeDeleteButton";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";

export default async function Page({searchParams}: { searchParams: { q?: string, } }) {

    const {q} = searchParams;
    const session = await getServerSession(authOptions);

    const mistakes = await prisma.commonMistake.findMany({
        where: {
            OR: [
                {name: {contains: q || '', mode: 'insensitive',}},
                {facility: {contains: q || '', mode: 'insensitive',}}
            ]
        },
        orderBy: {
            name: 'asc',
        },
    });

    return session?.user && (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} justifyContent="space-between" sx={{mb: 2,}}>
                    <Stack direction="column" spacing={1}>
                        <Typography variant="h5">Common Mistakes</Typography>
                    </Stack>
                    {session?.user.roles.includes("STAFF") && <Link href="/training/mistakes/new">
                        <Button variant="contained" size="large" startIcon={<Add/>}>New Mistake</Button>
                    </Link>}
                </Stack>
                <SearchForm label="Search by name or facility" q={q}/>
                <TableContainer sx={{mt: 2,}}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Facility</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mistakes.map((mistake) => (
                                <TableRow key={mistake.id}>
                                    <TableCell>{mistake.name}</TableCell>
                                    <TableCell>{mistake.facility}</TableCell>
                                    <TableCell>
                                        <Link href={`/training/mistakes/${mistake.id}`}
                                              style={{color: 'inherit',}}>
                                            <IconButton>
                                                <Visibility/>
                                            </IconButton>
                                        </Link>
                                        {session.user.roles.includes("STAFF") &&
                                            <>
                                                <Link href={`/training/mistakes/${mistake.id}/edit`}
                                                      style={{color: 'inherit',}}>
                                                    <IconButton>
                                                        <Edit/>
                                                    </IconButton>
                                                </Link>
                                                <CommonMistakeDeleteButton mistake={mistake}/>
                                            </>
                                        }
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