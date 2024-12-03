import React from 'react';
import prisma from "@/lib/db";
import {Card, CardContent, Typography} from "@mui/material";
import OrderList from "@/components/Order/OrderList";
import {updateCertificationTypeOrder} from "@/actions/certificationTypes";

export default async function Page() {

    const certificationTypes = await prisma.certificationType.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Certification Types Order</Typography>
                <OrderList items={certificationTypes.map((ct) => ({
                    id: ct.id,
                    name: ct.name,
                    order: ct.order,
                }))} onSubmit={updateCertificationTypeOrder}/>
            </CardContent>
        </Card>
    );

}