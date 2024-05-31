'use client';
import React, {useEffect, useState} from 'react';
import {LessonRubricCell, LessonRubricCriteria, RubricCriteraScore} from "@prisma/client";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import Markdown from "react-markdown";

export default function LessonRubricGridInteractive({criteria, cells, scores, getScores}: {
    criteria: LessonRubricCriteria[],
    cells: LessonRubricCell[],
    scores?: RubricCriteraScore[]
    getScores: (scores: Record<string, number>) => void
}) {

    const [selectedScores, setSelectedScores] = useState<Record<string, number>>(criteria.reduce((acc, criterion) => {
        const score = scores?.find((score) => score.criteriaId === criterion.id);
        acc[criterion.id as string] = cells.find((cell) => cell.id === score?.cellId)?.points || 0;
        return acc;
    }, {} as any));

    const maxPoints = Math.max(...criteria.map(criterion => criterion.maxPoints));

    const handleCellClick = (criterionId: string, points: number) => {
        setSelectedScores((prev) => {
            return {
                ...prev,
                [criterionId]: points
            }
        });
    }

    useEffect(() => {
        getScores(selectedScores);
    }, [selectedScores]);

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Criteria (hover for description)</TableCell>
                            {Array.from({length: maxPoints + 1}, (_, i) => i).map((point) => (
                                <TableCell key={point} align="center">{point}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {criteria.map((criterion) => (
                            <TableRow key={criterion.id}>
                                <Tooltip title={<Markdown>{criterion.description}</Markdown>}>
                                    <TableCell>{criterion.criteria}</TableCell>
                                </Tooltip>
                                {Array.from({length: criterion.maxPoints + 1}, (_, i) => i).map((point) => (
                                    <TableCell key={point} align="center"
                                               onClick={() => handleCellClick(criterion.id, point)} sx={{
                                        border: 1,
                                        backgroundColor: selectedScores[criterion.id] === point ? 'rgba(0, 100, 200, 0.2)' : 'inherit',
                                        cursor: 'pointer',
                                    }}>
                                        {cells.filter((c) => c.criteriaId === criterion.id).find((cell) => cell.points === point)?.description}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}