import React from 'react';
import {RubricCriteraScore} from "@prisma/client";
import prisma from "@/lib/db";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export default async function LessonRubricGrid({lessonId, scores}: {
    lessonId: string,
    scores?: RubricCriteraScore[]
}) {

    const criteria = await prisma.lessonRubricCriteria.findMany({
        where: {
            rubric: {
                Lesson: {
                    id: lessonId,
                },
            },
        },
        include: {
            cells: true,
        },
    });

    const maxPoints = Math.max(...criteria.map(criterion => criterion.maxPoints));

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Criteria</TableCell>
                        {Array.from({length: maxPoints + 1}, (_, i) => i).map((point) => (
                            <TableCell key={point} align="center">{point}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {criteria.map((criterion) => (
                        <TableRow key={criterion.id}>
                            <TableCell>{criterion.criteria}</TableCell>
                            {Array.from({length: criterion.maxPoints + 1}, (_, i) => i).map((point) => (
                                <TableCell key={point} align="center" sx={{border: 1}}>
                                    {criterion.cells.find((cell) => cell.points === point)?.description}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}