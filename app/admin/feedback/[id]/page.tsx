import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import FeedbackCard from "@/components/Feedback/FeedbackCard";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

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