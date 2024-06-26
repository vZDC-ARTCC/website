import React from 'react';
import {File} from '@prisma/client';
import {IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Link from "next/link";
import {Edit, OpenInNew} from "@mui/icons-material";
import {UTApi} from "uploadthing/server";
import FileDeleteButton from "@/components/Files/FileDeleteButton";

const ut = new UTApi();

export default async function FileTable({files, admin}: { files: File[], admin?: boolean, }) {

    const urls: any = {};

    for (const file of files) {
        urls[file.id] = (await ut.getFileUrls([file.key])).data[0].url;
    }

    return (
        <TableContainer sx={{}}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Updated At (UTC)</TableCell>
                        {admin && <TableCell>Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((file) => (
                        <TableRow key={file.id}>
                            <TableCell>
                                <Link href={urls[file.id]} target="_blank" style={{color: 'inherit',}}>
                                    <Stack direction="row" alignItems="center">
                                        {file.name}
                                        <OpenInNew fontSize="small"/>
                                    </Stack>
                                </Link>
                            </TableCell>
                            <TableCell>{file.description}</TableCell>
                            <TableCell>{file.updatedAt.toUTCString()}</TableCell>
                            {admin && <TableCell>
                                <Link href={`/admin/files/${file.categoryId}/${file.id}`}
                                      style={{color: 'inherit',}}>
                                    <IconButton>
                                        <Edit/>
                                    </IconButton>
                                </Link>
                                <FileDeleteButton file={file}/>
                            </TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}