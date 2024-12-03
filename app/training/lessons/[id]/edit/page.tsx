import React from 'react';
import {
    Card,
    CardContent,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowBack, Edit} from "@mui/icons-material";
import LessonRubricCriteriaDeleteButton from "@/components/Lesson/LessonRubricCriteriaDeleteButton";
import LessonForm from "@/components/Lesson/LessonForm";
import LessonRubricCriteriaForm from "@/components/Lesson/LessonRubricCriteriaForm";

export default async function Page(props: { params: Promise<{ id: string, }>, }) {
    const params = await props.params;

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
                <Stack direction="row" spacing={2} alignItems="center">
                    <Link href={`/training/lessons/`}
                          style={{color: 'inherit',}}>
                        <Tooltip title="Go Back">
                            <IconButton color="inherit">
                                <ArrowBack fontSize="large"/>
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Typography variant="h5" sx={{mb: 2,}}>{lesson.identifier} - {lesson.name}</Typography>
                </Stack>
                <Stack direction="column" spacing={2}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{mb: 1,}}>Lesson Details</Typography>
                            <LessonForm lesson={lesson}/>
                        </CardContent>
                    </Card>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{mb: 1,}}>Lesson Rubric Criteria</Typography>
                            {!lesson.rubric || lesson.rubric.items.length === 0 &&
                                <Typography>No criteria found; create one below.</Typography>}
                            {lesson.rubric && lesson.rubric.items.length > 0 && <TableContainer>
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
                            </TableContainer>}
                        </CardContent>
                    </Card>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{mb: 2,}}>New Lesson Rubric Criteria</Typography>
                            <LessonRubricCriteriaForm lesson={lesson}/>
                        </CardContent>
                    </Card>
                </Stack>
            </CardContent>
        </Card>
    );
}