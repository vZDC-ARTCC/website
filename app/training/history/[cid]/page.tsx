import React from 'react';
import TrainingSessionTable from '@/components/TrainingSession/TrainingSessionTable';
import prisma from '@/lib/db';
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Box, Typography} from "@mui/material";

export default async function Page(props: { params: Promise<{ cid: string, }>, }) {
    const params = await props.params;

    const session = await getServerSession(authOptions);

    const {cid} = params;

    const controller = await prisma.user.findUnique({
        where: {
            cid: cid
        },
    });

    let isInstructor = false;
    const mentorCID = session!.user.cid;

    if (session!.user.roles.includes("INSTRUCTOR") || session!.user.roles.includes("STAFF")){
        isInstructor = true;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{mb: 1,}}>Training Sessions</Typography>
            <TrainingSessionTable admin isInstructor={isInstructor} mentorCID={mentorCID}
                                  onlyUser={controller as User}/>
        </Box>
    );
}