import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Typography} from "@mui/material";
import CommonMistakeForm from "@/components/CommonMistake/CommonMistakeForm";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";

export default async function Page({params}: { params: { id: string } }) {

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
                <Typography sx={{mb: 2,}}>{mistake.facility && `${mistake.facility} - `}{mistake.name}</Typography>
                <CommonMistakeForm mistake={mistake}/>
            </CardContent>
        </Card>
    );
}
