import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import LogTable from "@/components/Logs/LogTable";
import WebmasterLogTable from "@/components/Webmaster/WebmasterLogTable";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Logs</Typography>
                <WebmasterLogTable/>
            </CardContent>
        </Card>
    );
}