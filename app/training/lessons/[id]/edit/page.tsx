import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Card, CardContent, Typography} from "@mui/material";
import LessonForm from "@/components/Lesson/LessonForm";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";

export default async function Page({params}: { params: { id: string, }, }) {

    const {id} = params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user.roles.includes("STAFF")) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">You must be staff to access this page.</Typography>
                </CardContent>
            </Card>
        );
    }

    const lesson = await prisma.lesson.findUnique({
        where: {
            id,
        }
    });

    if (!lesson) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>{lesson.identifier} - {lesson.name}</Typography>
                <LessonForm lesson={lesson}/>
            </CardContent>
        </Card>
    );
}