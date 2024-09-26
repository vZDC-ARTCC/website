import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {UTApi} from "uploadthing/server";
import {Card, CardContent, IconButton, Typography} from "@mui/material";
import {OpenInNew} from "@mui/icons-material";
import Link from "next/link";
import {Metadata} from "next";

const ut = new UTApi();

export async function generateMetadata(
    {params}: { params: { id: string, } },
): Promise<Metadata> {

    const file = await prisma.file.findUnique({
        where: {
            id: params.id,
        },
    });

    if (!file) {
        return {}
    }

    return {
        title: `${file.name} | vZDC`,
    };
}

export default async function Page({params}: { params: { id: string, }, }) {

    const file = await prisma.file.findUnique({
        where: {
            id: params.id,
        },
    });

    if (!file) {
        notFound();
    }

    const url = (await ut.getFileUrls([file.key])).data[0]?.url;

    return (
        <Card>
            <CardContent>
                <Link href={url} style={{textDecoration: 'none', color: 'inherit',}} target="_blank">
                    <Typography variant="h4" sx={{mb: 1,}}>{file.name}
                        <IconButton size="large">
                            <OpenInNew fontSize="large"/>
                        </IconButton>
                    </Typography>
                </Link>
                <iframe src={url} style={{width: '100%', height: '100vh', border: 'none',}}/>
            </CardContent>
        </Card>
    );

}