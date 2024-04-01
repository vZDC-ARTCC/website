import React from 'react';
import {IconButton, Stack, Tooltip, Typography} from "@mui/material";
import ProfileEditCard from "@/components/Profile/ProfileEditCard";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {ArrowBack} from "@mui/icons-material";
import Link from "next/link";

export default async function Page() {

    const session = await getServerSession(authOptions);

    const user = session?.user;

    return user && (
        <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Link href="/profile/overview" style={{color: 'inherit',}}>
                    <Tooltip title="Go Back">
                        <IconButton color="inherit">
                            <ArrowBack fontSize="large"/>
                        </IconButton>
                    </Tooltip>
                </Link>
                <Typography variant="h4">Edit Profile</Typography>
            </Stack>
            <ProfileEditCard user={user}/>
        </Stack>
    );
}