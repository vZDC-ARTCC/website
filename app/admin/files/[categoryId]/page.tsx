import React from 'react';
import {Card, CardContent, Stack, Typography} from "@mui/material";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import FileCategoryForm from "@/components/Files/FileCategoryForm";
import FileTable from "@/components/Files/FileTable";
import FileForm from "@/components/Files/FileForm";

export default async function Page(props: { params: Promise<{ categoryId: string }> }) {
    const params = await props.params;

    const fileCategory = await prisma.fileCategory.findUnique({
        where: {
            id: params.categoryId,
        },
        include: {
            files: true,
        },
    });

    if (!fileCategory) {
        notFound();
    }

    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h5">File Category - {fileCategory.name}</Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{mb: 1,}}>Edit Category</Typography>
                    <FileCategoryForm fileCategory={fileCategory}/>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{mb: 1,}}>Files</Typography>
                    <FileTable files={fileCategory.files} admin/>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{mb: 1,}}>New File</Typography>
                    <FileForm category={fileCategory}/>
                </CardContent>
            </Card>
        </Stack>
    );
}