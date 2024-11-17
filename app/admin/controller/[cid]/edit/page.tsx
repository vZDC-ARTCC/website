import React from 'react';
import prisma from "@/lib/db";
import ProfileEditCard from "@/components/Profile/ProfileEditCard";
import {notFound} from "next/navigation";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/auth/auth";

export default async function Page(props: { params: Promise<{ cid: string }> }) {
    const params = await props.params;

    const session = await getServerSession(authOptions);

    if (!session) {
        notFound();
    }

    const user = await prisma.user.findUnique({
        where: {
            cid: params.cid,
        },
    });

    if (!user) {
        notFound();
    }

    return (
        <ProfileEditCard user={user as User} sessionUser={session.user} admin/>
    );
}