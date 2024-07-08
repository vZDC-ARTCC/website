import React from 'react';
import prisma from "@/lib/db";
import {notFound} from "next/navigation";
import {Grid} from "@mui/material";
import ProfileCard from "@/components/Profile/ProfileCard";
import {User} from "next-auth";
import StaffPositionCard from "@/components/Role/StaffPositionCard";
import RoleCard from "@/components/Role/RoleCard";

export default async function Page({params}: { params: { cid: string } }) {

    const {cid} = params;

    const user = await prisma.user.findUnique({
        where: {
            cid,
        },
    });

    if (!user) {
        notFound();
    }

    return (
        <Grid container columns={2} spacing={2}>
            <Grid item xs={2}>
                <ProfileCard user={user as User} admin/>
            </Grid>
            <Grid item xs={2} md={1}>
                <RoleCard user={user as User}/>
            </Grid>
            <Grid item xs={2} md={1}>
                <StaffPositionCard user={user as User}/>
            </Grid>
        </Grid>
    );
}