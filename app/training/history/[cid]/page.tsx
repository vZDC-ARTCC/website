import React from 'react';
import TrainingSessionHistory from '@/components/TrainingSession/TrainingSessionHistory';
import prisma from '@/lib/db';
import { User } from "next-auth";

export default async function Page({params}: { params: { cid: string, }, }) {

    const {cid} = params;

    const controller = await prisma.user.findUnique({
        where: {
            cid: cid
        },
    });
 
    return (
        <TrainingSessionHistory admin onlyUser={controller as User}/>
    );
}