import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Card, CardContent, Typography} from "@mui/material";
import FileForm from "@/components/Files/FileForm";

export default async function Page({params}: { params: { categoryId: string } }) {

    const {categoryId} = params;

    const fileCategory = await prisma.fileCategory.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!fileCategory) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>New File - {fileCategory.name}</Typography>
                <FileForm category={fileCategory}/>
            </CardContent>
        </Card>
    );
}