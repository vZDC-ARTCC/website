import React from 'react';
import {Typography} from "@mui/material";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import ChangeLogForm from '@/components/Changelog/ChangeLogForm';

export default async function Page({params}: { params: { id: string } }) {

    const changeLog = await prisma.version.findUnique({
        where: {
            id: params.id
        },
        include : {
            changeDetails: true
        }
    });

    if (!changeLog) {
        notFound();
    }

    return (
        <>
            <Typography variant="h5" sx={{mb: 2,}}>Edit Changelog</Typography>
            <ChangeLogForm changeLog={changeLog}/>
        </>
    );

}