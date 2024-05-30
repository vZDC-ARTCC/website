import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import Markdown from "react-markdown";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import LessonRubricGrid from "@/components/Lesson/LessonRubricGrid";

export default async function LessonCard({lessonId}: { lessonId: string }) {

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
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
                <Typography variant="h5">{lesson.name}</Typography>
                <Typography variant="subtitle2" sx={{mb: 2,}}>{lesson.identifier}</Typography>
                <Markdown>
                    {lesson.description}
                </Markdown>
                <Typography variant="h6">Grading</Typography>
                <LessonRubricGrid lessonId={lessonId}/>
            </CardContent>
        </Card>
    );
}