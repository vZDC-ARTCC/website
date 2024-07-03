import React from 'react';
import TrainingSessionHistory from '@/components/TrainingSession/TrainingSessionHistory';
import prisma from '@/lib/db';

export default async function Page({params}: { params: { cid: string, }, }) {

    const {cid} = params;

    console.log(cid)

    const controller = await prisma.user.findUnique({
        where: {
            cid: cid
        },
    });

    return (
        <TrainingSessionHistory onlyUser={controller}/>
    );
}