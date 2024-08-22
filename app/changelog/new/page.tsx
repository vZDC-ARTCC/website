import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import ChangeLogForm from "@/components/Changelog/ChangeLogForm";
import getConfig from "next/config";


export default async function Page() {

    const {publicRuntimeConfig} = getConfig();

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>New Changelog Version</Typography>
                <ChangeLogForm latestVersion={publicRuntimeConfig.version}/>
            </CardContent>
        </Card>
    );

}