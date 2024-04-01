import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import LogTable from "@/components/Logs/LogTable";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Logs</Typography>
                <LogTable/>
            </CardContent>
        </Card>
    );
}