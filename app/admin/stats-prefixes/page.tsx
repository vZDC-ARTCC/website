import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import prisma from "@/lib/db";
import StatisticsPrefixesForm from "@/components/StatisticsPrefixes/StatisticsPrefixesForm";

export default async function Page() {

    const prefixes = await prisma.statisticsPrefixes.findFirst();

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>Statistics Prefixes</Typography>
                <StatisticsPrefixesForm prefixes={prefixes}/>
            </CardContent>
        </Card>
    );
}