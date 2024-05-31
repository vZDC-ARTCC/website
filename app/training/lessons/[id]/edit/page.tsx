import React from 'react';
import {
    Box,
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
import {Edit} from "@mui/icons-material";
import LessonRubricCriteriaDeleteButton from "@/components/Lesson/LessonRubricCriteriaDeleteButton";
import LessonForm from "@/components/Lesson/LessonForm";
import LessonRubricCriteriaForm from "@/components/Lesson/LessonRubricCriteriaForm";

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
                        orderBy: {
                            criteria: 'asc',
                        }
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
                    <Stack direction="column" spacing={2}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{mb: 1,}}>Lesson Rubric Criteria</Typography>
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
                                                        <Link
                                                            href={`/training/lessons/${lesson.id}/edit/${criteria.id}`}>
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
                            </CardContent>
                        </Card>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{mb: 2,}}>New Lesson Rubric Criteria</Typography>
                                <LessonRubricCriteriaForm lesson={lesson}/>
                            </CardContent>
                        </Card>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}