import React from 'react';
import {Box, Card, CardContent, Typography} from "@mui/material";
import VisitorApplicationTable from "@/components/VisitorApplication/VisitorApplicationTable";
import VisitorApplicationTabs from "@/components/VisitorApplication/VisitorApplicationTabs";
import {VisitorApplicationStatus} from "@prisma/client";

export default async function Page({searchParams}: { searchParams: { status?: string, }, }) {

    const status = searchParams.status || "PENDING";

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 1,}}>Visitor Applications</Typography>
                <VisitorApplicationTabs/>
                <VisitorApplicationTable status={status as VisitorApplicationStatus}/>
            </CardContent>
        </Card>
    );
}