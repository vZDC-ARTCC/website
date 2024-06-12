import React from 'react';
import {User} from "next-auth";
import {Card, CardContent, Typography} from "@mui/material";
import RoleForm from "@/components/Role/RoleForm";

export default async function RoleCard({user}: { user: User, }) {

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{mb: 2,}}>Roles</Typography>
                <RoleForm user={user}/>
            </CardContent>
        </Card>
    );
}