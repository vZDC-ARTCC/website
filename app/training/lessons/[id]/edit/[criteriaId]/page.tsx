import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
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
import LessonRubricCriteriaForm from "@/components/Lesson/LessonRubricCriteriaForm";
import {LessonRubricCriteria} from "@prisma/client";
import Link from "next/link";
import {Add, Edit} from "@mui/icons-material";
import LessonCriteriaCellDeleteButton from "@/components/Lesson/LessonCriteriaCellDeleteButton";

export default async function Page({params}: { params: { id: string, criteriaId: string } }) {

    const {criteriaId} = params;

    const criteria = await prisma.lessonRubricCriteria.findUnique({
        where: {
            id: criteriaId,
        },
        include: {
            rubric: {
                include: {
                    Lesson: true,
                },
            },
            cells: {
                orderBy: {
                    points: 'asc',
                },
            },
        },
    });

    if (!criteria) {
        notFound();
    }

    return criteria.rubric.Lesson && (
        <Card>
            <CardContent>
                <Typography variant="h5">{criteria.criteria}</Typography>
                <Typography variant="subtitle2"
                            sx={{mb: 2,}}>{criteria.rubric.Lesson.identifier} - {criteria.rubric.Lesson.name}</Typography>
                <LessonRubricCriteriaForm lesson={criteria.rubric.Lesson} criteria={criteria as LessonRubricCriteria}/>
                <Box>
                    <Stack direction={{xs: 'column', md: 'row',}} spacing={2} justifyContent="space-between"
                           sx={{my: 2,}}>
                        <Typography variant="h6">Criteria Cells</Typography>
                        <Link href={`/training/lessons/${criteria.rubric.Lesson.id}/edit/${criteria.id}/new`}>
                            <Button variant="contained" startIcon={<Add/>}>New Criteria Cell</Button>
                        </Link>
                    </Stack>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Points</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {criteria.cells.map((cell) => (
                                    <TableRow key={cell.id}>
                                        <TableCell>{cell.description}</TableCell>
                                        <TableCell>{cell.points}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/training/lessons/${criteria.rubric.Lesson?.id}/edit/${criteria.id}/${cell.id}`}>
                                                <IconButton size="small">
                                                    <Edit/>
                                                </IconButton>
                                            </Link>
                                            <LessonCriteriaCellDeleteButton criteriaCell={cell}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </CardContent>
        </Card>
    );
}