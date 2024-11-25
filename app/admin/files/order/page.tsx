import React from 'react';
import prisma from "@/lib/db";
import {Card, CardContent, Typography} from "@mui/material";
import OrderList from "@/components/Order/OrderList";
import {updateFileCategoryOrder} from "@/actions/files";

export default async function Page() {

    const fileCategories = await prisma.fileCategory.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>File Category Order</Typography>
                <OrderList items={fileCategories.map((fc) => ({
                    id: fc.id,
                    name: fc.name,
                    order: fc.order,
                }))} onSubmit={updateFileCategoryOrder}/>
            </CardContent>
        </Card>
    );
}