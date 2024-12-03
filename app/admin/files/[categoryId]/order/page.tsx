import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import OrderList from "@/components/Order/OrderList";
import {updateFileOrder} from "@/actions/files";
import prisma from "@/lib/db";
import {notFound} from "next/navigation";

export default async function Page({params}: { params: Promise<{ categoryId: string }> }) {

    const {categoryId} = await params;
    const fileCategory = await prisma.fileCategory.findUnique({
        where: {id: categoryId},
    });

    if (!fileCategory) {
        notFound();
    }

    const files = await prisma.file.findMany({
        where: {categoryId},
        orderBy: {
            order: 'asc',
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>File Category Order - {fileCategory.name}</Typography>
                <OrderList items={files.map((fc) => ({
                    id: fc.id,
                    name: fc.name,
                    order: fc.order,
                }))} onSubmit={async (order) => {
                    'use server'
                    await updateFileOrder(fileCategory, order)
                }}/>
            </CardContent>
        </Card>
    );
}