import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import IncidentTable from "@/components/Incident/IncidentTable";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Incident Reports</Typography>
                <IncidentTable/>
            </CardContent>
        </Card>
    );
}