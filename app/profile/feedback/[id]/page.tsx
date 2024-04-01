import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import FeedbackCard from "@/components/Feedback/FeedbackCard";
import {authOptions} from "@/auth/auth";
import {getServerSession} from "next-auth";

export default async function Page({params}: { params: { id: string } }) {

    const {id} = params;
    const session = await getServerSession(authOptions);

    const feedback = await prisma.feedback.findUnique({
        where: {
            id: id,
            controller: {
                id: session?.user.id,
            },
            status: "RELEASED",
        },
        include: {
            controller: true,
        },
    });

    if (!feedback) {
        notFound();
    }

    return (
        <FeedbackCard feedback={feedback}/>
    );
}