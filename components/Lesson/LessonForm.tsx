import React from 'react';
import {Lesson} from "@prisma/client";
import {Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import LessonDetailsForm from "@/components/Lesson/LessonDetailsForm";
import prisma from "@/lib/db";

export default async function LessonForm({lesson}: { lesson?: Lesson, }) {

    const rubricCriteria = await prisma.lessonRubricCriteria.findMany({
        where: {
            rubric: {
                Lesson: {
                    id: lesson?.id || '',
                },
            },
        },
        include: {
            cells: true,
        },
    });

    return (
        <Stack direction="column" spacing={2}>
            <Box>
                <Typography variant="h6" sx={{mb: 1,}}>Lesson Details</Typography>
                <LessonDetailsForm lesson={lesson}/>
            </Box>
            {lesson &&
                <>
                    <Box>
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
                                    {rubricCriteria.map((criteria) => (
                                        <TableRow key={criteria.id}>
                                            <TableCell>{criteria.criteria}</TableCell>
                                            <TableCell>{criteria.cells.length}</TableCell>
                                            <TableCell>{criteria.maxPoints}</TableCell>
                                            <TableCell>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            }
        </Stack>
    );
}