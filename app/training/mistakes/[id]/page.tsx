import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Typography} from "@mui/material";
import Markdown from "react-markdown";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const {id} = params;

    const mistake = await prisma.commonMistake.findUnique({
        where: {
            id,
        }
    });

    if (!mistake) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5"
                            sx={{mb: 2,}}>{mistake.facility && `${mistake.facility} - `}{mistake.name}</Typography>
                <Markdown>{mistake.description}</Markdown>
            </CardContent>
        </Card>
    );
}