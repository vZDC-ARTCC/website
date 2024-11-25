import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import TrainingProgressionForm from "@/components/TrainingProgression/TrainingProgressionForm";

export default async function Page() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>New Training Progression</Typography>
                <TrainingProgressionForm/>
            </CardContent>
        </Card>
    );
}