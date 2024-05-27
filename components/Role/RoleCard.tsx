import React from 'react';
import {getServerSession, User} from "next-auth";
import {Card, CardContent, Typography} from "@mui/material";
import RoleForm from "@/components/Role/RoleForm";
import {authOptions} from "@/auth/auth";

export default async function RoleCard({user}: { user: User, }) {

    const session = await getServerSession(authOptions);

    return session?.user && (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{mb: 2,}}>Roles</Typography>
                <RoleForm user={user} sessionUser={session.user}/>
            </CardContent>
        </Card>
    );
}