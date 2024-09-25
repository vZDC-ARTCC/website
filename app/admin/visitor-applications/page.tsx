import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import VisitorApplicationTable from "@/components/VisitorApplication/VisitorApplicationTable";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 1,}}>Visitor Applications</Typography>
                <VisitorApplicationTable/>
            </CardContent>
        </Card>
    );
}