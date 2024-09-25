import React from 'react';
import {
    Card,
    CardContent,
    Typography
} from "@mui/material";
import StaffingRequestTable from "@/components/StaffingRequest/StaffingRequestTable";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Staffing Requests</Typography>
                <StaffingRequestTable/>
            </CardContent>
        </Card>
    );
}