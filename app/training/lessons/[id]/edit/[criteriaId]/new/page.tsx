import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Typography} from "@mui/material";
import LessonCriteriaCellForm from "@/components/Lesson/LessonCriteriaCellForm";

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
        },
    });

    if (!criteria) {
        notFound();
    }

    return criteria.rubric.Lesson && (
        <Card>
            <CardContent>
                <Typography variant="h5">New Criteria Cell (({criteria.rubric.Lesson.identifier}))</Typography>
                <Typography variant="subtitle2" sx={{mb: 2,}}>{criteria.criteria}</Typography>
                <LessonCriteriaCellForm lesson={criteria.rubric.Lesson} criteria={criteria}/>
            </CardContent>
        </Card>
    );
}