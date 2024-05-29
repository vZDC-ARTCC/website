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
import SearchForm from "@/components/Search/SearchForm";
import prisma from "@/lib/db";
import Link from "next/link";
import {Add, Edit, Visibility} from "@mui/icons-material";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import LessonDeleteButton from "@/components/Lesson/LessonDeleteButton";

export default async function Page({searchParams}: { searchParams: { q?: string, } }) {

    const {q} = searchParams;
    const session = await getServerSession(authOptions);

    const lessons = await prisma.lesson.findMany({
        where: {
            OR: [
                {identifier: {contains: q || '', mode: 'insensitive',}},
                {name: {contains: q || '', mode: 'insensitive',}}
            ]
        },
        orderBy: {
            identifier: 'asc',
        },
    });

    return session?.user && (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} justifyContent="space-between" sx={{mb: 2,}}>
                    <Stack direction="column" spacing={1}>
                        <Typography variant="h5">Lessons</Typography>
                    </Stack>
                    {session?.user.roles.includes("STAFF") && <Link href="/training/lessons/new">
                        <Button variant="contained" size="large" startIcon={<Add/>}>New Lesson</Button>
                    </Link>}
                </Stack>
                <SearchForm label="Search by identifier or name" q={q}/>
                <TableContainer sx={{mt: 2,}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Identifier</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lessons.map(lesson => (
                                <TableRow key={lesson.id}>
                                    <TableCell>{lesson.identifier}</TableCell>
                                    <TableCell>{lesson.name}</TableCell>
                                    <TableCell>
                                        <Link href={`/training/lessons/${lesson.id}`} passHref>
                                            <IconButton size="small">
                                                <Visibility/>
                                            </IconButton>
                                        </Link>
                                        {session?.user.roles.includes("STAFF") &&
                                            <>
                                                <Link href={`/training/lessons/${lesson.id}/edit`} passHref>
                                                    <IconButton size="small">
                                                        <Edit/>
                                                    </IconButton>
                                                </Link>
                                                <LessonDeleteButton lesson={lesson}/>
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