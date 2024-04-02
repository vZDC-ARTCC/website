import React from 'react';
import {User} from "next-auth";
import {Card, CardContent, Typography} from "@mui/material";

export default function TrainingCard({user}: { user: User, }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Training Tickets</Typography>
            </CardContent>
        </Card>
    );
}