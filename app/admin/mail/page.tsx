import React from 'react';
import prisma from "@/lib/db";
import {Card, CardContent, Typography} from "@mui/material";
import MailForm from "@/components/Mail/MailForm";
import {User} from "next-auth";

export type MailGroup = {
    name: string;
    ids: string[];
}

export default async function Page() {

    const users = await prisma.user.findMany({
        where: {
            controllerStatus: {
                not: "NONE",
            },
        },
    });

    const groups: MailGroup[] = [
        {
            name: 'Home Observers',
            ids: users.filter(user => user.rating === 1 && user.controllerStatus === "HOME").map(user => user.id),
        },
        {
            name: 'Home S1',
            ids: users.filter(user => user.rating === 2 && user.controllerStatus === "HOME").map(user => user.id),
        },
        {
            name: 'Home S2',
            ids: users.filter(user => user.rating === 3 && user.controllerStatus === "HOME").map(user => user.id),
        },
        {
            name: 'Home S3',
            ids: users.filter(user => user.rating === 4 && user.controllerStatus === "HOME").map(user => user.id),
        },
        {
            name: 'Home C1/C3',
            ids: users.filter(user => [5, 6, 7].includes(user.rating) && user.controllerStatus === "HOME").map(user => user.id),
        },
        {
            name: 'Instructors',
            ids: users.filter(user => user.roles.includes("INSTRUCTOR")).map(user => user.id),
        },
        {
            name: 'Mentors',
            ids: users.filter(user => user.roles.includes("MENTOR")).map(user => user.id),
        },
        {
            name: 'Visiting Controllers',
            ids: users.filter(user => user.controllerStatus === "VISITOR").map(user => user.id),
        },
        {
            name: 'All Training Staff',
            ids: users.filter(user => user.roles.some((r) => ["MENTOR", "INSTRUCTOR"].includes(r))).map(user => user.id),
        },
    ];

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 2,}}>Send Mass Email</Typography>
                <MailForm allUsers={users as User[]} groups={groups}/>
            </CardContent>
        </Card>
    );
}