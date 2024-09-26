import React from 'react';
import {Box, Card, CardContent, IconButton, Stack, Typography} from "@mui/material";
import FileCategoryForm from "@/components/Files/FileCategoryForm";
import prisma from "@/lib/db";
import Link from "next/link";
import {CloudUpload, Edit} from "@mui/icons-material";
import FileCategoryDeleteButton from "@/components/Files/FileCategoryDeleteButton";
import FileTable from "@/components/Files/FileTable";

export default async function Page() {

    const fileCategories = await prisma.fileCategory.findMany({
        include: {
            files: {
                orderBy: {
                    name: 'asc',
                },
            },
        },
        orderBy: {
            name: 'asc',
        },
    });

    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h5">File Center</Typography>
                </CardContent>
            </Card>
            {fileCategories.map((fileCategory) => (
                <Card key={fileCategory.id}>
                    <CardContent>
                        <Stack direction="row" spacing={1} justifyContent="space-between" sx={{mb: 1,}}>
                            <Typography variant="h6">{fileCategory.name}</Typography>
                            <Box>
                                <Link href={`/admin/files/${fileCategory.id}/new`}>
                                    <IconButton>
                                        <CloudUpload/>
                                    </IconButton>
                                </Link>
                                <Link href={`/admin/files/${fileCategory.id}`}
                                      style={{color: 'inherit',}}>
                                    <IconButton>
                                        <Edit/>
                                    </IconButton>
                                </Link>
                                <FileCategoryDeleteButton fileCategory={fileCategory}/>
                            </Box>
                        </Stack>
                        <FileTable files={fileCategory.files} admin/>
                    </CardContent>
                </Card>
            ))}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{mb: 1,}}>New File Category</Typography>
                    <FileCategoryForm/>
                </CardContent>
            </Card>
        </Stack>
    );

}