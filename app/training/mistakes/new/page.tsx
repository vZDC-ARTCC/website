import React from 'react';
import {Card, CardContent, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import Link from "next/link";
import {ArrowBack} from "@mui/icons-material";
import CommonMistakeForm from "@/components/CommonMistake/CommonMistakeForm";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user.roles.includes("STAFF")) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">You must be staff to access this page.</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 1,}}>
                    <Link href="/training/mistakes" style={{color: 'inherit',}}>
                        <Tooltip title="Go Back">
                            <IconButton color="inherit">
                                <ArrowBack fontSize="large"/>
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Typography variant="h5">New Common Mistake</Typography>
                </Stack>
                <CommonMistakeForm/>
            </CardContent>
        </Card>
    );

}