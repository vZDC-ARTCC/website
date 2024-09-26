import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import LoaTable from "@/components/LOA/LOATable";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Leave of Absences</Typography>
                <LoaTable/>
            </CardContent>
        </Card>
    );

}