import React from 'react';
import {Card, CardContent} from "@mui/material";
import TrainingSessionInformation from "@/components/TrainingSession/TrainingSessionInformation";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";

export default async function Page({params}: { params: { id: string } }) {

    const {id} = params;

    const session = await getServerSession(authOptions);

    const trainingSession = await prisma.trainingSession.findUnique({
        where: {
            id: id,
        },
        include: {
            student: true,
        },
    });

    if (!trainingSession || trainingSession.student.id !== session?.user.id) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <TrainingSessionInformation id={id}/>
            </CardContent>
        </Card>
    );
}