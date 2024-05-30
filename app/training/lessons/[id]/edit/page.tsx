import React from 'react';
import {
    Box,
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
import {notFound} from "next/navigation";
import Link from "next/link";
import {Add, Edit} from "@mui/icons-material";
import LessonRubricCriteriaDeleteButton from "@/components/Lesson/LessonRubricCriteriaDeleteButton";
import LessonForm from "@/components/Lesson/LessonForm";

export default async function Page({params}: { params: { id: string, }, }) {

    const {id} = params;

    const lesson = await prisma.lesson.findUnique({
        where: {
            id,
        },
        include: {
            rubric: {
                include: {
                    items: {
                        include: {
                            cells: true,
                        },
                    },
                },
            },
        },
    });

    if (!lesson) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>{lesson.identifier} - {lesson.name}</Typography>
                <Stack direction="column" spacing={2}>
                    <Box>
                        <Typography variant="h6" sx={{mb: 1,}}>Lesson Details</Typography>
                        <LessonForm lesson={lesson}/>
                    </Box>
                    <Box>
                        <Stack direction={{xs: 'column', md: 'row',}} spacing={2} justifyContent="space-between"
                               sx={{mb: 1,}}>
                            <Typography variant="h6">Lesson Rubric Criteria</Typography>
                            <Link href={`/training/lessons/${lesson.id}/edit/new`}>
                                <Button variant="contained" startIcon={<Add/>}>New Lesson Criteria</Button>
                            </Link>
                        </Stack>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Criteria</TableCell>
                                        <TableCell>Cells</TableCell>
                                        <TableCell>Max Points</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lesson.rubric?.items.map((criteria) => (
                                        <TableRow key={criteria.id}>
                                            <TableCell>{criteria.criteria}</TableCell>
                                            <TableCell>{criteria.cells.length}</TableCell>
                                            <TableCell>{criteria.maxPoints}</TableCell>
                                            <TableCell>
                                                <Link href={`/training/lessons/${lesson.id}/edit/${criteria.id}`}>
                                                    <IconButton size="small">
                                                        <Edit/>
                                                    </IconButton>
                                                </Link>
                                                <LessonRubricCriteriaDeleteButton rubricCriteria={criteria}/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}