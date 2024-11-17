import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import FeedbackCard from "@/components/Feedback/FeedbackCard";
import {authOptions} from "@/auth/auth";
import {getServerSession} from "next-auth";
import {Box, Button} from "@mui/material";
import Link from "next/link";
import {KeyboardArrowLeft} from "@mui/icons-material";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

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
        <Box>
            <Link href="/profile/feedback" style={{color: 'inherit',}}>
                <Button color="inherit" startIcon={<KeyboardArrowLeft/>} sx={{mb: 2,}}>All feedback</Button>
            </Link>
            <FeedbackCard feedback={feedback}/>
        </Box>
    );
}