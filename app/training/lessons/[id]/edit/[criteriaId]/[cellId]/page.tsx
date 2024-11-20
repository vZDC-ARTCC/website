import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import LessonCriteriaCellForm from "@/components/Lesson/LessonCriteriaCellForm";

export default async function Page(
    props: { params: Promise<{ id: string, criteriaId: string, cellId: string }> }
) {
    const params = await props.params;

    const {cellId} = params;

    const cell = await prisma.lessonRubricCell.findUnique({
        where: {
            id: cellId,
        },
        include: {
            criteria: {
                include: {
                    rubric: {
                        include: {
                            Lesson: true,
                        },
                    },
                },
            },
        },
    });

    if (!cell) {
        notFound();
    }

    return cell.criteria.rubric.Lesson && (
        <Card>
            <CardContent>
                <Typography
                    variant="h5">{cell.criteria.criteria} ({cell.criteria.rubric.Lesson.identifier})</Typography>
                <Typography variant="subtitle2" sx={{mb: 2,}}>{cell.points} points</Typography>
                <LessonCriteriaCellForm lesson={cell.criteria.rubric.Lesson} criteria={cell.criteria} cell={cell}/>
            </CardContent>
        </Card>
    );
}