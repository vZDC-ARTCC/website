import React from 'react';
import {User} from "next-auth";
import {Card, CardContent, Typography} from "@mui/material";
import StaffPositionForm from "@/components/Role/StaffPositionForm";

export default function StaffPositionCard({user}: { user: User }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{mb: 2,}}>Staff Positions</Typography>
                <StaffPositionForm user={user}/>
            </CardContent>
        </Card>
    );
}