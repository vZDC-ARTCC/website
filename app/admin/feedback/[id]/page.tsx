import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import FeedbackCard from "@/components/Feedback/FeedbackCard";

export default async function Page({params}: { params: { id: string } }) {

    const {id} = params;

    const feedback = await prisma.feedback.findUnique({
        where: {
            id,
        },
        include: {
            controller: true,
            pilot: true,
        },
    });

    if (!feedback) {
        notFound();
    }

    return (
        <FeedbackCard feedback={feedback} admin/>
    );
}