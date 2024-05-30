import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Typography} from "@mui/material";
import LessonRubricCriteriaForm from "@/components/Lesson/LessonRubricCriteriaForm";

export default async function Page({params}: { params: { id: string, } }) {

    const {id} = params;

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: id,
        },
    });

    if (!lesson) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">New Lesson Criteria</Typography>
                <Typography variant="subtitle2" sx={{mb: 2,}}>{lesson.identifier} - {lesson.name}</Typography>
                <LessonRubricCriteriaForm lesson={lesson}/>
            </CardContent>
        </Card>
    );
}